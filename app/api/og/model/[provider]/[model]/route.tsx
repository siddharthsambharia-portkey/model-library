import { ImageResponse } from '@vercel/og'
import { getModel } from '@/lib/models'
import { formatPrice, formatContextWindow } from '@/lib/types'
import { getProviderGradient } from '@/lib/gradients'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string; model: string }> }
) {
  const { provider, model: modelId } = await params
  const model = await getModel(provider, modelId)

  if (!model) {
    return new Response('Model not found', { status: 404 })
  }

  const gradient = getProviderGradient(provider)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          background: '#000000',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gradient Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)`,
          }}
        />

        {/* Dot Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle, ${gradient.from}20 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* Provider Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {model.providerDisplayName.charAt(0)}
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {model.providerDisplayName}
            </span>
          </div>

          {/* Model Name */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'auto' }}>
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 600,
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {model.id}
            </h1>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {model.maxOutputTokens && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 28px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                  Output
                </span>
                <span style={{ fontSize: '28px', fontWeight: 600, color: 'white' }}>
                  {formatContextWindow(model.maxOutputTokens)}
                </span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 28px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                Input Price
              </span>
              <span style={{ fontSize: '28px', fontWeight: 600, color: 'white' }}>
                {formatPrice(model.pricing?.input)}/M
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 28px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                Output Price
              </span>
              <span style={{ fontSize: '28px', fontWeight: 600, color: 'white' }}>
                {formatPrice(model.pricing?.output)}/M
              </span>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            {model.features.vision && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#10B981' }}>
                  👁️ Vision
                </span>
              </div>
            )}
            {model.features.function_calling && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#3B82F6' }}>
                  🔧 Tools
                </span>
              </div>
            )}
            {model.features.reasoning && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#F59E0B' }}>
                  🧠 Reasoning
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
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
              P
            </div>
            <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.5)' }}>
              portkey.ai/models
            </span>
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
