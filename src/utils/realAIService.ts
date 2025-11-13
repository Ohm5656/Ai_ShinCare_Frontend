// Real AI Service using Supabase Edge Functions
// This file provides integration with actual AI APIs (OpenAI, Claude, etc.)
// through Supabase Edge Functions for security

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIServiceConfig {
  supabaseUrl: string;
  supabaseKey: string;
  maxHistoryMessages?: number;
}

export class RealAIService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private conversationHistory: ChatMessage[] = [];
  private maxHistoryMessages: number;

  constructor(config: AIServiceConfig) {
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
    this.maxHistoryMessages = config.maxHistoryMessages || 10;
  }

  /**
   * Generate AI response using Supabase Edge Function
   * @param userMessage - The user's message
   * @param language - Language for the response (th, en, zh)
   * @returns AI-generated response
   */
  async generateResponse(
    userMessage: string,
    language: 'th' | 'en' | 'zh' = 'th'
  ): Promise<string> {
    try {
      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Keep only recent messages to save tokens
      const recentHistory = this.conversationHistory.slice(-this.maxHistoryMessages);

      // Call Supabase Edge Function
      const response = await fetch(
        `${this.supabaseUrl}/functions/v1/chat-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.supabaseKey}`,
          },
          body: JSON.stringify({
            message: userMessage,
            language: language,
            conversationHistory: recentHistory
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.response;

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Log usage for monitoring (optional)
      if (data.usage) {
        this.logUsage(data.usage);
      }

      return aiResponse;

    } catch (error) {
      console.error('Real AI Service Error:', error);
      throw error;
    }
  }

  /**
   * Generate response with retry logic
   * Useful for handling temporary network issues
   */
  async generateResponseWithRetry(
    userMessage: string,
    language: 'th' | 'en' | 'zh' = 'th',
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateResponse(userMessage, language);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError || new Error('Failed after maximum retries');
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Get history length
   */
  getHistoryLength(): number {
    return this.conversationHistory.length;
  }

  /**
   * Remove old messages beyond max limit
   */
  trimHistory() {
    if (this.conversationHistory.length > this.maxHistoryMessages) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryMessages);
    }
  }

  /**
   * Log usage for monitoring and cost tracking
   * @private
   */
  private logUsage(usage: any) {
    // You can send this to your analytics service
    // or store in Supabase for cost tracking
    console.log('AI Usage:', {
      timestamp: new Date().toISOString(),
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      estimated_cost: this.estimateCost(usage)
    });
  }

  /**
   * Estimate cost based on usage
   * Based on OpenAI GPT-4o-mini pricing (as of 2024)
   * @private
   */
  private estimateCost(usage: any): number {
    // GPT-4o-mini pricing (Nov 2024)
    const INPUT_COST_PER_1M = 0.150; // USD
    const OUTPUT_COST_PER_1M = 0.600; // USD

    const inputCost = (usage.prompt_tokens / 1_000_000) * INPUT_COST_PER_1M;
    const outputCost = (usage.completion_tokens / 1_000_000) * OUTPUT_COST_PER_1M;
    
    return inputCost + outputCost;
  }
}

/**
 * Factory function to create RealAIService
 * Automatically reads from environment variables if available
 */
export function createRealAIService(): RealAIService | null {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found in environment variables');
    return null;
  }

  return new RealAIService({
    supabaseUrl,
    supabaseKey,
    maxHistoryMessages: 10
  });
}

/**
 * Hybrid AI Service
 * Automatically falls back to Mock AI if Real AI fails
 */
export class HybridAIService {
  private realAI: RealAIService | null;
  private mockAI: any; // AIResponseEngine type

  constructor(
    realAI: RealAIService | null,
    mockAI: any
  ) {
    this.realAI = realAI;
    this.mockAI = mockAI;
  }

  async generateResponse(
    userMessage: string,
    language: 'th' | 'en' | 'zh' = 'th'
  ): Promise<{ response: string; source: 'real' | 'mock' }> {
    // Try Real AI first if available
    if (this.realAI) {
      try {
        const response = await this.realAI.generateResponseWithRetry(userMessage, language, 2);
        return { response, source: 'real' };
      } catch (error) {
        console.warn('Real AI failed, falling back to Mock AI:', error);
      }
    }

    // Fallback to Mock AI
    const response = this.mockAI.generateResponse(userMessage);
    return { response, source: 'mock' };
  }

  clearHistory() {
    if (this.realAI) {
      this.realAI.clearHistory();
    }
  }
}

// Export types for use in other files
export type { AIServiceConfig };
