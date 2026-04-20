const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const PROVIDER_DEFAULTS = {
  openrouter: {
    url: OPENROUTER_URL,
    model: 'meta-llama/llama-3.1-8b-instruct'
  },
  groq: {
    url: GROQ_URL,
    model: 'llama-3.1-8b-instant'
  }
}

const extractJson = (rawText) => {
  if (!rawText) return null
  const cleaned = rawText.trim()

  // Try direct JSON parse first
  try {
    return JSON.parse(cleaned)
  } catch {}

  // Remove markdown code blocks
  let withoutMarkdown = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '')
  if (withoutMarkdown !== cleaned) {
    try {
      return JSON.parse(withoutMarkdown)
    } catch {}
  }

  // Find and extract JSON object
  const objectStart = cleaned.indexOf('{')
  const objectEnd = cleaned.lastIndexOf('}')
  const arrayStart = cleaned.indexOf('[')
  const arrayEnd = cleaned.lastIndexOf(']')

  let startIdx = -1
  let endIdx = -1

  if (objectStart !== -1 && objectEnd !== -1) {
    startIdx = objectStart
    endIdx = objectEnd + 1
  }

  if (arrayStart !== -1 && arrayEnd !== -1) {
    if (startIdx === -1 || arrayStart < startIdx) {
      startIdx = arrayStart
      endIdx = arrayEnd + 1
    }
  }

  if (startIdx !== -1 && endIdx > startIdx) {
    try {
      return JSON.parse(cleaned.slice(startIdx, endIdx))
    } catch {}
  }

  return null
}

export const createAiClient = () => {
  const provider = (process.env.AI_PROVIDER || 'openrouter').toLowerCase()
  const providerConfig = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.openrouter
  const apiKey = process.env.AI_API_KEY
  const model = process.env.AI_MODEL || providerConfig.model
  const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS || 30000)
  const maxTokens = Number(process.env.AI_MAX_TOKENS || 2000)

  const generateJson = async ({ systemPrompt, userPrompt, temperature = 0.5 }) => {
    if (!apiKey) {
      console.error('[AI Client] ERROR: Missing API key')
      return {
        ok: false,
        reason: 'missing_api_key',
        data: null
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    let res
    try {
      console.log(`[AI Client] Making request to ${provider} (${model})...`)
      res = await fetch(providerConfig.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      })
    } catch (error) {
      if (error?.name === 'AbortError') {
        console.error(`[AI Client] Request timeout after ${timeoutMs}ms`)
        return {
          ok: false,
          reason: 'timeout',
          data: null,
          detail: `Request timed out after ${timeoutMs}ms`
        }
      }

      console.error(`[AI Client] Network error: ${error?.message}`)
      return {
        ok: false,
        reason: 'provider_error',
        data: null,
        detail: error?.message || 'Unknown provider error'
      }
    } finally {
      clearTimeout(timeoutId)
    }

    if (!res.ok) {
      let errorText = ''
      try {
        errorText = await res.text()
      } catch (e) {
        errorText = `Failed to read response: ${e?.message}`
      }
      console.error(`[AI Client] HTTP ${res.status}: ${errorText.substring(0, 200)}`)
      return {
        ok: false,
        reason: 'provider_error',
        data: null,
        detail: errorText
      }
    }

    let payload
    try {
      payload = await res.json()
    } catch (error) {
      console.error(`[AI Client] Failed to parse response JSON: ${error?.message}`)
      return {
        ok: false,
        reason: 'invalid_response_format',
        data: null,
        detail: error?.message
      }
    }

    const text = payload?.choices?.[0]?.message?.content || ''
    if (!text) {
      console.error('[AI Client] Empty response content from API')
      return {
        ok: false,
        reason: 'empty_response',
        data: null,
        detail: 'API returned empty content'
      }
    }

    console.log(`[AI Client] Response received (${text.length} chars), parsing JSON...`)
    const parsed = extractJson(text)

    if (!parsed) {
      console.error(`[AI Client] Failed to extract JSON. Raw response: ${text.substring(0, 300)}`)
      return {
        ok: false,
        reason: 'invalid_json',
        data: null,
        detail: text
      }
    }

    console.log(`[AI Client] Successfully parsed JSON response`)
    return {
      ok: true,
      reason: null,
      data: parsed
    }
  }

  console.log(`[AI Client] Initialized: provider=${provider}, model=${model}, timeout=${timeoutMs}ms, maxTokens=${maxTokens}`)
  
  return {
    provider,
    model,
    generateJson
  }
}
