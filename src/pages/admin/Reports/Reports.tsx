import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const Reports: React.FC = () => {
  const reports = [
    { id: 1, name: 'Monthly Sales Report', date: '2024-01-15', size: '2.5 MB', type: 'PDF' },
    { id: 2, name: 'User Activity Report', date: '2024-01-10', size: '1.8 MB', type: 'Excel' },
    { id: 3, name: 'Financial Summary', date: '2024-01-05', size: '3.2 MB', type: 'PDF' },
    { id: 4, name: 'Inventory Report', date: '2024-01-01', size: '1.5 MB', type: 'Excel' },
  ];

  return (
    <div className="w-full">
      {/* Mobile view - custom header */}
      <div className="md:hidden">
        <div className="w-full min-h-screen bg-background">
          {/* Custom centered header for mobile */}
          <div className="bg-background border-b border-border p-4 sticky top-0 z-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-4 pb-6">
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap gap-3 mb-4">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="w-full sm:w-auto">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-card-foreground">Available Reports</h2>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-border">
                    {reports.map((report) => (
                      <div key={report.id} className="p-6 hover:bg-accent transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{report.name}</h3>
                              <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>{report.date}</span>
                                <span>•</span>
                                <span>{report.size}</span>
                                <span>•</span>
                                <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="secondary" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block space-y-6 w-full p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
            <p className="text-muted-foreground">Download and manage your reports</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-card-foreground">Available Reports</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-accent transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{report.name}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{report.date}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-muted rounded text-xs">
                            {report.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};