import { ImageResponse } from '@vercel/og'
import { getModel } from '@/lib/models'
import { formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const modelsParam = searchParams.get('models')

  if (!modelsParam) {
    return new Response('Models parameter required', { status: 400 })
  }

  const modelIds = modelsParam.split(',').slice(0, 4)
  const models = await Promise.all(
    modelIds.map(async (id) => {
      const [provider, modelId] = id.split(':')
      return getModel(provider, modelId)
    })
  )

  const validModels = models.filter(Boolean)

  if (validModels.length < 2) {
    return new Response('At least 2 valid models required', { status: 400 })
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px',
          background: '#000000',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: 'white',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Model Comparison
          </h1>
        </div>

        {/* Models Grid */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flex: 1,
          }}
        >
          {validModels.map((model, index) => {
            if (!model) return null
            const gradient = getProviderGradient(model.provider)
            
            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)`,
                  border: `1px solid ${gradient.from}30`,
                }}
              >
                {/* Provider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    {model.providerDisplayName.charAt(0)}
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {model.providerDisplayName}
                  </span>
                </div>

                {/* Model Name */}
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: 'white',
                    margin: 0,
                    marginBottom: '20px',
                    lineHeight: 1.2,
                  }}
                >
                  {model.id}
                </h2>

                {/* Stats */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginTop: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Input
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                      {formatPrice(model.pricing?.input)}/M
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Output
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                      {formatPrice(model.pricing?.output)}/M
                    </span>
                  </div>
                  {model.maxOutputTokens && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Output
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                        {formatContextWindow(model.maxOutputTokens)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  {model.features.vision && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                      }}
                    >
                      👁️ Vision
                    </span>
                  )}
                  {model.features.function_calling && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3B82F6',
                      }}
                    >
                      🔧 Tools
                    </span>
                  )}
                  {model.features.reasoning && (
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#F59E0B',
                      }}
                    >
                      🧠 Reasoning
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
            portkey.ai/compare
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
