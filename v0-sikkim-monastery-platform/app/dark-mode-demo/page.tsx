import { DarkModeToggle, DarkModeToggleCompact } from '@/components/ui/dark-mode-toggle'

export default function DarkModeDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold">Dark Mode Toggle Demo</h1>
          <p className="text-muted-foreground text-lg">
            Test the dark mode toggle components with different sizes and styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Toggle Switch Variants */}
          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-2xl font-heading font-semibold">Toggle Switch Variants</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Small Size</span>
                <DarkModeToggle size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Size (Default)</span>
                <DarkModeToggle size="md" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Large Size</span>
                <DarkModeToggle size="lg" />
              </div>
            </div>
          </div>

          {/* Compact Button Variant */}
          <div className="space-y-6 p-6 border rounded-lg bg-card">
            <h2 className="text-2xl font-heading font-semibold">Compact Button</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compact Toggle</span>
                <DarkModeToggleCompact />
              </div>
            </div>
          </div>
        </div>

        {/* Content to show theme changes */}
        <div className="space-y-6 p-6 border rounded-lg bg-card">
          <h2 className="text-2xl font-heading font-semibold">Theme Preview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <h3 className="font-semibold">Primary</h3>
              <p className="text-sm opacity-90">Primary color scheme</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
              <h3 className="font-semibold">Secondary</h3>
              <p className="text-sm opacity-90">Secondary color scheme</p>
            </div>
            
            <div className="p-4 rounded-lg bg-accent text-accent-foreground">
              <h3 className="font-semibold">Accent</h3>
              <p className="text-sm opacity-90">Accent color scheme</p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="space-y-6 p-6 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-heading font-semibold">Usage Instructions</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Import the component:</h3>
              <code className="block p-2 bg-muted rounded text-xs">
                {`import { DarkModeToggle, DarkModeToggleCompact } from '@/components/ui/dark-mode-toggle'`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Use the toggle switch:</h3>
              <code className="block p-2 bg-muted rounded text-xs">
                {`<DarkModeToggle size="md" className="ml-4" />`}
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Use the compact button:</h3>
              <code className="block p-2 bg-muted rounded text-xs">
                {`<DarkModeToggleCompact className="ml-4" />`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
