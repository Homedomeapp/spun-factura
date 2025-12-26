# Content Bot - Instalación

## Requisitos
- Cuenta de Anthropic con API key
- Permisos de admin en el repositorio

## Paso 1: Configurar API Key
1. Ve a Settings → Secrets → Actions
2. New secret: `ANTHROPIC_API_KEY`
3. Valor: Tu API key (sk-ant-...)

## Paso 2: Configurar permisos
1. Settings → Actions → General
2. Workflow permissions → Read and write
3. Marcar "Allow GitHub Actions to create PRs"

## Uso
1. Issues → New Issue → "Content Bot"
2. Rellena el formulario
3. El bot crea un PR automáticamente
4. Revisas y haces merge
5. Vercel despliega