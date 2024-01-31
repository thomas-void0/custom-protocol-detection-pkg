interface Window {
  opera?: unknown
  InstallTrigger?: null
  chrome?: Record<string, any>
  MSStream?: unknown
}

interface Document {
  documentMode?: Document["DOCUMENT_NODE"]
}

interface Navigator {
  msLaunchUri?: any
}