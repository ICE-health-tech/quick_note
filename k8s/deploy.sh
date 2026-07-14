#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NS=quick-note

echo "==> Ensure minikube is running"
minikube status >/dev/null 2>&1 || minikube start

echo "==> Apply manifests"
kubectl apply -f "$ROOT/k8s/00-namespace.yaml"
kubectl apply -f "$ROOT/k8s/01-config.yaml"
kubectl apply -f "$ROOT/k8s/02-postgres.yaml"
kubectl apply -f "$ROOT/k8s/03-postgres-deploy.yaml"
kubectl apply -f "$ROOT/k8s/04-backend.yaml"
kubectl apply -f "$ROOT/k8s/06-nginx-config.yaml"
kubectl apply -f "$ROOT/k8s/05-frontend.yaml"
kubectl apply -f "$ROOT/k8s/07-watchtower.yaml"

echo "==> Wait for pods"
kubectl -n "$NS" rollout status deployment/quick-note-postgres --timeout=180s
kubectl -n "$NS" rollout status deployment/quick-note-backend --timeout=180s
kubectl -n "$NS" rollout status deployment/quick-note-frontend --timeout=120s

echo "==> Status"
kubectl -n "$NS" get pods,svc

echo ""
echo "Open app:"
echo "  minikube service quick-note-frontend -n $NS"
echo "  or: http://\$(minikube ip):30080"
