# 🛠️ Solução Global para Problemas de Codificação

Este documento explica como resolver problemas de codificação e caracteres invisíveis no projeto Vue.js.

## 🚨 Problemas Comuns

### 1. VueCompilerError: Invalid end tag
- **Causa**: Caracteres invisíveis ou problemas de codificação
- **Solução**: Use o script de limpeza automática

### 2. Caracteres estranhos no código
- **Causa**: BOM (Byte Order Mark) ou caracteres de controle
- **Solução**: Configuração do EditorConfig + script de limpeza

## 🛠️ Ferramentas Implementadas

### 1. Script de Limpeza Automática
```bash
# Limpar todos os arquivos
npm run clean

# Ou executar diretamente
node scripts/clean-files.js
```

### 2. ESLint Aprimorado
```bash
# Verificar problemas
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

### 3. Limpeza Automática antes do Lint
O script `pre-lint` executa automaticamente antes do lint:
```bash
npm run lint  # Executa clean + lint automaticamente
```

## 📁 Arquivos de Configuração

### .editorconfig
- Padroniza codificação UTF-8
- Define quebras de linha LF
- Remove espaços em branco no final

### .gitattributes
- Configura tratamento correto no Git
- Define arquivos como texto ou binário
- Garante codificação consistente

### package.json (ESLint)
- Regras para detectar caracteres invisíveis
- Formatação consistente
- Validação de estrutura Vue

## 🔧 Como Usar

### Para Desenvolvedores

1. **Instale a extensão EditorConfig** no seu editor
2. **Execute limpeza antes de commitar**:
   ```bash
   npm run clean
   npm run lint
   ```

3. **Use os scripts de desenvolvimento**:
   ```bash
   npm run serve    # Desenvolvimento
   npm run lint     # Verificação + limpeza automática
   npm run build    # Build de produção
   ```

### Para Novos Arquivos

1. **Sempre use UTF-8 sem BOM**
2. **Use quebras de linha LF** (não CRLF)
3. **Não deixe espaços em branco no final das linhas**
4. **Termine arquivos com uma quebra de linha**

### Para Arquivos Existentes

1. **Execute o script de limpeza**:
   ```bash
   npm run clean
   ```

2. **Verifique com ESLint**:
   ```bash
   npm run lint
   ```

3. **Corrija problemas automaticamente**:
   ```bash
   npm run lint:fix
   ```

## 🚀 Prevenção

### Configuração do VS Code
Adicione ao `settings.json`:
```json
{
  "files.encoding": "utf8",
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Configuração do WebStorm/IntelliJ
- File → Settings → Editor → File Encodings
- Set "Global Encoding" to UTF-8
- Set "Project Encoding" to UTF-8
- Check "Create UTF-8 files for new files"

## 🔍 Detecção de Problemas

### Sintomas de Problemas de Codificação
- Erros de compilação Vue inexplicáveis
- Caracteres estranhos no código
- Problemas de indentação
- Erros de "Invalid end tag"

### Comandos de Diagnóstico
```bash
# Verificar problemas de codificação
npm run lint

# Verificar arquivos específicos
npx eslint src/components/ListaTemas/ListaTemas.html

# Verificar todos os arquivos HTML
npx eslint "src/**/*.html"
```

## 📝 Checklist de Commit

Antes de fazer commit, verifique:

- [ ] `npm run clean` executado
- [ ] `npm run lint` sem erros
- [ ] Arquivos salvos em UTF-8
- [ ] Quebras de linha LF
- [ ] Sem espaços em branco no final

## 🆘 Solução de Emergência

Se um arquivo estiver com problemas graves:

1. **Delete e recrie o arquivo**:
   ```bash
   rm src/components/Problema/Problema.html
   # Recrie o arquivo manualmente
   ```

2. **Use o script de limpeza**:
   ```bash
   npm run clean
   ```

3. **Verifique a codificação**:
   ```bash
   file -i src/components/Problema/Problema.html
   ```

## 📚 Recursos Adicionais

- [EditorConfig](https://editorconfig.org/)
- [ESLint Vue Rules](https://eslint.vuejs.org/)
- [UTF-8 Encoding](https://en.wikipedia.org/wiki/UTF-8)
- [Git Attributes](https://git-scm.com/docs/gitattributes) 