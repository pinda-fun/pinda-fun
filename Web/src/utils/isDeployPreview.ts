export default function isDeployPreview() {
  return /deploy-preview-[0-9]+--pinda-fun\.netlify\.com/.test(window.location.origin);
}
