# Text Completion API

This document describes the Text Completion API, which provides a clean interface for generating text completions using the configured LLM provider.

## API Endpoint

```
POST /api/text-completion/complete
```

## Request Format

```json
{
  "text": "The quick brown fox",
  "maxTokens": 100,
  "temperature": 0.7
}
```

### Request Parameters

| Parameter    | Type   | Required | Description                                                  |
|--------------|--------|----------|--------------------------------------------------------------|
| text         | string | Yes      | The input text to be completed by the LLM                    |
| maxTokens    | number | No       | Maximum number of tokens to generate (default: 1000)         |
| temperature  | number | No       | Temperature parameter controlling randomness (default: 0.7)  |

## Response Format

```json
{
  "completion": "The quick brown fox jumps over the lazy dog.",
  "originalText": "The quick brown fox",
  "usage": {
    "promptTokens": 5,
    "completionTokens": 6,
    "totalTokens": 11
  }
}
```

### Response Fields

| Field         | Type   | Description                                   |
|---------------|--------|-----------------------------------------------|
| completion    | string | The generated text completion                 |
| originalText  | string | The original input text                       |
| usage         | object | Token usage information (if available)        |

## Error Handling

The API returns standard HTTP status codes:

- 200 OK: Request successful
- 400 Bad Request: Missing or invalid parameters
- 500 Internal Server Error: Processing error

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:3000/api/text-completion/complete \
  -H "Content-Type: application/json" \
  -d '{"text": "The quick brown fox", "maxTokens": 50, "temperature": 0.5}'
```

### Using JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:3000/api/text-completion/complete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'The quick brown fox',
    maxTokens: 50,
    temperature: 0.5
  }),
});

const data = await response.json();
console.log(data.completion);
``` 