import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DocumentsPage() {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      clients (
        name
      ),
      deals (
        title
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">Manage and organize your documents</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading documents: {error.message}</p>
          </CardContent>
        </Card>
      ) : documents && documents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">{doc.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doc.type && (
                    <Badge variant="secondary">{doc.type}</Badge>
                  )}
                  {doc.clients && (
                    <p className="text-sm text-muted-foreground">
                      Client: {(doc.clients as any).name}
                    </p>
                  )}
                  {doc.deals && (
                    <p className="text-sm text-muted-foreground">
                      Deal: {(doc.deals as any).title}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No documents found. Upload your first document to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
