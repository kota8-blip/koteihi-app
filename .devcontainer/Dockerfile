FROM node:18-bullseye

# 最低限のビルドツール（古い依存があっても安心）
RUN apt-get update && apt-get install -y --no-install-recommends \
    make g++ git ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
