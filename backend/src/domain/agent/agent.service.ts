import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { IAgentRepository } from './agent.repository.i';
import { IStageRepository } from '../stage/stage.repository.i';
import { Agent } from './agent.entity';
import { CreateAgentDto, UpdateAgentDto, OptimizeAgentsDto, ClaudeOptimizationResponse } from './agent.types';
import { PaginationParams, PaginatedResult } from '../domain.types';

@Injectable()
export class AgentService {
    private anthropic: Anthropic;

    constructor(
        @Inject('IAgentRepository')
        private readonly agentRepository: IAgentRepository,
        @Inject('IStageRepository')
        private readonly stageRepository: IStageRepository,
    ) {
        // Initialize Anthropic client with API key
        this.anthropic = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY,
            timeout: 60000,
        });
    }

    async findById(id: string): Promise<Agent> {
        const agent = await this.agentRepository.findById(id);
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }
        return agent;
    }

    async findByName(name: string): Promise<Agent | null> {
        return this.agentRepository.findByName(name);
    }

    async create(data: CreateAgentDto): Promise<Agent> {
        const existingAgent = await this.agentRepository.findByName(data.name);
        if (existingAgent) {
            throw new ConflictException('Agent name already exists');
        }
        return this.agentRepository.create(data);
    }

    async update(id: string, data: UpdateAgentDto): Promise<Agent> {
        const agent = await this.findById(id);
        
        if (data.name && data.name !== agent.name) {
            const existingAgent = await this.agentRepository.findByName(data.name);
            if (existingAgent && existingAgent.id !== id) {
                throw new ConflictException('Agent name already exists');
            }
        }
        
        return this.agentRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.findById(id);
        await this.agentRepository.delete(id);
    }

    async findAll(params?: PaginationParams): Promise<PaginatedResult<Agent>> {
        return this.agentRepository.findAll(params || {});
    }

    async getStats(): Promise<{ totalAgents: number }> {
        const totalAgents = await this.agentRepository.count();
        return { totalAgents };
    }

    async optimizeAgents(data: OptimizeAgentsDto): Promise<{
        optimizedAgentId: string;
        optimizedAgentName: string;
        stagesCount: number;
        sourceAgentIds: string[];
        optimizationSummary: string;
    }> {
        // 1. Validate and fetch all agents
        if (data.agentIds.length < 2) {
            throw new BadRequestException('At least 2 agents are required for optimization');
        }

        const agents = await Promise.all(
            data.agentIds.map(id => this.findById(id))
        );

        // 2. Collect all stages from agents
        const allStages = [];
        for (const agent of agents) {
            const stages = await this.stageRepository.findByAgentId(agent.id);
            allStages.push(...stages.map(stage => ({
                agentName: agent.name,
                agentDescription: agent.description,
                ...stage
            })));
        }

        if (allStages.length === 0) {
            throw new BadRequestException('No stages found in the provided agents');
        }

        // 3. Call Claude API for optimization
        const claudeResponse = await this.callClaudeForOptimization(agents, allStages);

        // 4. Create optimized agent
        const optimizedAgentName = data.optimizedAgentName || claudeResponse.optimizedAgentName;
        const optimizedAgentDescription = data.optimizedAgentDescription || claudeResponse.optimizedAgentDescription;

        const optimizedAgent = await this.create({
            name: optimizedAgentName,
            description: optimizedAgentDescription,
            icon: '🚀'
        });

        // 5. Create optimized stages
        for (const stageData of claudeResponse.stages) {
            await this.stageRepository.create({
                ...stageData,
                agentId: optimizedAgent.id
            });
        }

        return {
            optimizedAgentId: optimizedAgent.id,
            optimizedAgentName: optimizedAgent.name,
            stagesCount: claudeResponse.stages.length,
            sourceAgentIds: data.agentIds,
            optimizationSummary: claudeResponse.optimizationSummary
        };
    }

    private async callClaudeForOptimization(agents: Agent[], allStages: any[]): Promise<ClaudeOptimizationResponse> {
        const agentsData = agents.map(agent => ({
            name: agent.name,
            description: agent.description,
            icon: agent.icon
        }));

        const stagesData = allStages.map(stage => ({
            agentName: stage.agentName,
            name: stage.name,
            description: stage.description,
            sequence: stage.sequence,
            input: stage.input,
            output: stage.output,
            vendor: stage.vendor,
            type: stage.type,
            evaluation: stage.evaluation
        }));

        const prompt = `You are an AI agent optimization expert. I have multiple AI agents with their stages that I want to optimize into a single, more efficient agent.

Here are the agents and their stages:

AGENTS:
${JSON.stringify(agentsData, null, 2)}

STAGES:
${JSON.stringify(stagesData, null, 2)}

Please analyze these agents and their stages, then create an optimized agent that:
1. Combines the best aspects of all agents
2. Eliminates redundancy
3. Optimizes the stage sequence for better performance
4. Maintains all essential functionality

Please respond with a JSON object in this exact format:
{
  "optimizedAgentName": "Name for the optimized agent",
  "optimizedAgentDescription": "Description explaining what this optimized agent does",
  "optimizationSummary": "Brief summary of the optimizations made",
  "stages": [
    {
      "name": "Stage name",
      "description": "Stage description (optional)",
      "sequence": 1,
      "input": "Input description",
      "output": "Output description",
      "vendor": "Vendor name",
      "type": "Stage type",
      "evaluation": {} // Optional evaluation object
    }
  ]
}

Make sure the response is valid JSON and includes at least 1 stage. Sequence numbers should start from 1 and be consecutive.`;

        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 60000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            });

            console.log(response.content[0]);
            const firstContent = response.content[0];
            let responseText = '';

            if (firstContent.type === "text") {
                responseText = firstContent.text;
            } else {
                throw new Error("Unexpected response content type from Claude");
            }

            // Extract JSON from response (in case Claude adds extra text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in Claude response');
            }

            const claudeResponse = JSON.parse(jsonMatch[0]) as ClaudeOptimizationResponse;

            // Validate response structure
            if (!claudeResponse.optimizedAgentName || !claudeResponse.stages || claudeResponse.stages.length === 0) {
                throw new Error('Invalid response structure from Claude');
            }

            return claudeResponse;
        } catch (error) {
            console.error('Error calling Claude API:', error);
            throw new BadRequestException('Failed to optimize agents using Claude API: ' + error.message);
        }
    }
}
