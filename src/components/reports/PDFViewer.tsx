
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfDocument: any; // jsPDF document
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  filename?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfDocument,
  open,
  onOpenChange,
  title = "PDF Document",
  filename = "document.pdf"
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const previousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };
  
  const nextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };
  
  const handleDownload = () => {
    if (pdfDocument) {
      pdfDocument.save(filename);
    }
  };
  
  // Generate PDF data URL when dialog opens
  React.useEffect(() => {
    if (open && pdfDocument) {
      try {
        const dataUrl = pdfDocument.output('dataurlstring');
        setPdfUrl(dataUrl);
      } catch (error) {
        console.error('Error generating PDF URL:', error);
      }
    } else {
      setPdfUrl(null);
      setPageNumber(1);
    }
  }, [open, pdfDocument]);
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-muted/20 rounded-md">
          {pdfUrl ? (
            <div className="h-full flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.error('Error loading PDF:', error)}
                className="pdf-document"
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between items-center pt-4">
          <div className="flex items-center gap-2">
            <Button onClick={zoomOut} size="sm" variant="outline">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button onClick={zoomIn} size="sm" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={previousPage} 
              disabled={pageNumber <= 1} 
              size="sm" 
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {pageNumber} / {numPages || 1}
            </span>
            <Button 
              onClick={nextPage} 
              disabled={pageNumber >= (numPages || 1)} 
              size="sm" 
              variant="outline"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={handleDownload} variant="default">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
