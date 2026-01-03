import { ImageResponse } from '@vercel/og'
import { getModel } from '@/lib/models'
import { formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderColor } from '@/lib/gradients'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string; model: string }> }
) {
  const { provider, model: modelId } = await params
  const model = await getModel(provider, modelId)

  if (!model) {
    return new Response('Model not found', { status: 404 })
  }

  const providerStyle = getProviderColor(provider)

  // Get capabilities
  const capabilities = []
  if (model.features.vision) capabilities.push('Vision')
  if (model.features.function_calling) capabilities.push('Tool Calling')
  if (model.features.reasoning) capabilities.push('Reasoning')
  if (model.modality.input.includes('image') && !model.features.vision) capabilities.push('Multimodal')
  if (capabilities.length === 0) capabilities.push('Text Generation')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: '#1A1915',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Vertical Lines Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to right, rgba(237,236,236,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 100%',
          }}
        />

        <div style={{ display: 'flex', width: '100%', height: '100%', padding: '50px' }}>
          {/* Left Side - Content */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: '40px' }}>
            {/* Provider */}
            <div
              style={{
                fontSize: '16px',
                color: 'rgba(237, 236, 236, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '40px',
              }}
            >
              {model.providerDisplayName}
            </div>

            {/* Capabilities */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(237, 236, 236, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '16px',
                }}
              >
                Capabilities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {capabilities.slice(0, 3).map((cap, i) => (
                  <div key={cap} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: 'rgba(237, 236, 236, 0.4)', fontSize: '16px', fontFamily: 'monospace', width: '20px' }}>
                      {i + 1}
                    </span>
                    <span style={{ color: '#EDECEC', fontSize: '18px', fontWeight: 500 }}>
                      {cap}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', color: 'rgba(237, 236, 236, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Input
                </div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: '#EDECEC', fontFamily: 'monospace' }}>
                  {formatPrice(model.pricing?.input)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', color: 'rgba(237, 236, 236, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Output
                </div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: '#EDECEC', fontFamily: 'monospace' }}>
                  {formatPrice(model.pricing?.output)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', color: 'rgba(237, 236, 236, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Tokens
                </div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: '#EDECEC', fontFamily: 'monospace' }}>
                  {formatContextWindow(model.maxOutputTokens) || '—'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', color: 'rgba(237, 236, 236, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Type
                </div>
                <div style={{ fontSize: '32px', fontWeight: 600, color: '#EDECEC', textTransform: 'capitalize' }}>
                  {model.type}
                </div>
              </div>
            </div>

            {/* Model Name */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', borderTop: '1px solid rgba(237, 236, 236, 0.08)', paddingTop: '24px' }}>
              <div style={{ fontSize: '36px', fontWeight: 600, color: '#EDECEC', marginBottom: '8px' }}>
                {model.name || model.id}
              </div>
              
              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: providerStyle.color,
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
                <span style={{ fontSize: '14px', color: 'rgba(237, 236, 236, 0.4)' }}>
                  portkey.ai/models
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Dot Matrix (simplified to rows of dots) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', paddingTop: '60px' }}>
            {Array.from({ length: 14 }).map((_, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: 12 }).map((_, colIndex) => {
                  let color = 'rgba(237, 236, 236, 0.08)'
                  
                  if (colIndex === 11) {
                    if (model.features.vision && rowIndex >= 0 && rowIndex <= 3) {
                      color = providerStyle.color
                    } else if (model.features.function_calling && rowIndex >= 4 && rowIndex <= 7) {
                      color = providerStyle.color
                    } else if ((model.features.reasoning || (model.pricing?.input || 0) > 5) && rowIndex >= 8 && rowIndex <= 11) {
                      color = '#F54E00'
                    }
                  }
                  
                  return (
                    <div
                      key={colIndex}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: color,
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
