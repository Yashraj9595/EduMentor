import React, { useRef } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';

interface BulkUploadSectionProps {
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
  bulkLoading: boolean;
}

export const BulkUploadSection: React.FC<BulkUploadSectionProps> = ({
  onFileSelect,
  onDownloadTemplate,
  bulkLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Bulk Account Creation</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onDownloadTemplate}
              disabled={bulkLoading}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download Template
            </Button>
            <Button
              onClick={triggerFileInput}
              disabled={bulkLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Excel File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="text-primary mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-foreground">Instructions</h4>
                <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Download the template and fill in the required information</li>
                  <li>Supports both student and mentor accounts in a single file</li>
                  <li>Maximum file size: 5MB</li>
                  <li>Supported formats: .xlsx, .xls, .csv</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};