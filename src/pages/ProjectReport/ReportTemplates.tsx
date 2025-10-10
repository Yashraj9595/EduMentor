import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Scale, 
  BookOpen, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  Eye
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: number;
  format: 'legal' | 'academic' | 'business';
  citationStyle: string;
  features: string[];
}

export const ReportTemplates: React.FC = () => {
  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'legal',
      name: 'Legal Research Report',
      description: 'Comprehensive legal research report with proper legal formatting and citations',
      sections: 14,
      format: 'legal',
      citationStyle: 'Bluebook',
      features: [
        'Cover Page with Legal Formatting',
        'Academic Declaration',
        'Comprehensive Literature Review',
        'Legal Analysis Framework',
        'Case Study Integration',
        'Professional Citations',
        'Table of Contents',
        'References & Bibliography'
      ]
    },
    {
      id: 'academic',
      name: 'Academic Research Report',
      description: 'Standard academic research report with APA formatting',
      sections: 10,
      format: 'academic',
      citationStyle: 'APA',
      features: [
        'Academic Cover Page',
        'Abstract & Keywords',
        'Literature Review',
        'Methodology Section',
        'Results & Analysis',
        'Discussion & Conclusion',
        'APA Citations',
        'Reference List'
      ]
    },
    {
      id: 'business',
      name: 'Business Report',
      description: 'Professional business report with executive summary and recommendations',
      sections: 9,
      format: 'business',
      citationStyle: 'APA',
      features: [
        'Executive Summary',
        'Business Analysis',
        'Market Research',
        'Financial Analysis',
        'Recommendations',
        'Implementation Plan',
        'Professional Formatting',
        'Business Citations'
      ]
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleUseTemplate = (templateId: string) => {
    // Navigate to report generator with selected template
    window.location.href = `/project-report?template=${templateId}`;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'legal':
        return <Scale className="h-6 w-6" />;
      case 'academic':
        return <BookOpen className="h-6 w-6" />;
      case 'business':
        return <Briefcase className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'legal':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'business':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Report Templates</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from professionally designed templates for different types of reports. 
          Each template includes proper formatting, citation styles, and section structures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFormatIcon(template.format)}
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getFormatColor(template.format)}>
                      {template.format.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {template.sections} sections
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {template.citationStyle}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                  {template.features.length > 4 && (
                    <li className="text-xs text-muted-foreground">
                      +{template.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview template
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template.id);
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Selected Template Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Template Information</h4>
              <p className="text-sm text-muted-foreground">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">All Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {templates.find(t => t.id === selectedTemplate)?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => handleUseTemplate(selectedTemplate)}
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Creating Report
            </Button>
            <Button 
              variant="outline"
              onClick={() => setSelectedTemplate('')}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export is now at the top of the file
