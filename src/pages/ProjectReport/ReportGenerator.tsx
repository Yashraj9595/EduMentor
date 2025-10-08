import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/SelectNew';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Separator } from '@/components/ui/Separator';
import { 
  FileText, 
  Download, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  FileCode,
  File,
  Users,
  Calendar,
  Building,
  GraduationCap,
  Scale,
  Globe,
  Database,
  Shield,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RefreshCw
} from 'lucide-react';

interface ReportSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  completed: boolean;
  wordCount: number;
  order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'legal' | 'academic' | 'business';
  citationStyle: 'bluebook' | 'apa' | 'mla' | 'oscola';
}

interface ReportData {
  title: string;
  author: string;
  studentId: string;
  email: string;
  supervisor: string;
  supervisorTitle: string;
  department: string;
  university: string;
  city: string;
  country: string;
  date: string;
  degree: string;
  field: string;
  abstract: string;
  keywords: string[];
  sections: ReportSection[];
  template: string;
  format: string;
  citationStyle: string;
}

export const ReportGenerator: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    title: '',
    author: '',
    studentId: '',
    email: '',
    supervisor: '',
    supervisorTitle: '',
    department: '',
    university: '',
    city: '',
    country: '',
    date: new Date().toLocaleDateString(),
    degree: '',
    field: '',
    abstract: '',
    keywords: [],
    sections: [],
    template: 'legal',
    format: 'pdf',
    citationStyle: 'bluebook'
  });

  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: 'legal',
      name: 'Legal Research Report',
      description: 'Comprehensive legal research report with proper legal formatting and citations',
      format: 'legal',
      citationStyle: 'bluebook',
      sections: [
        { id: 'cover', title: 'Cover Page', content: '', required: true, completed: false, wordCount: 0, order: 1 },
        { id: 'declaration', title: 'Declaration', content: '', required: true, completed: false, wordCount: 0, order: 2 },
        { id: 'acknowledgement', title: 'Acknowledgements', content: '', required: true, completed: false, wordCount: 0, order: 3 },
        { id: 'abstract', title: 'Abstract', content: '', required: true, completed: false, wordCount: 0, order: 4 },
        { id: 'toc', title: 'Table of Contents', content: '', required: true, completed: false, wordCount: 0, order: 5 },
        { id: 'list-tables', title: 'List of Tables/Figures', content: '', required: false, completed: false, wordCount: 0, order: 6 },
        { id: 'abbreviations', title: 'List of Abbreviations', content: '', required: false, completed: false, wordCount: 0, order: 7 },
        { id: 'chapter1', title: 'Chapter 1: Introduction', content: '', required: true, completed: false, wordCount: 0, order: 8 },
        { id: 'chapter2', title: 'Chapter 2: Literature Review', content: '', required: true, completed: false, wordCount: 0, order: 9 },
        { id: 'chapter3', title: 'Chapter 3: Legal Analysis', content: '', required: true, completed: false, wordCount: 0, order: 10 },
        { id: 'chapter4', title: 'Chapter 4: Case Studies', content: '', required: true, completed: false, wordCount: 0, order: 11 },
        { id: 'chapter5', title: 'Chapter 5: Conclusion', content: '', required: true, completed: false, wordCount: 0, order: 12 },
        { id: 'references', title: 'References', content: '', required: true, completed: false, wordCount: 0, order: 13 },
        { id: 'appendices', title: 'Appendices', content: '', required: false, completed: false, wordCount: 0, order: 14 }
      ]
    },
    {
      id: 'academic',
      name: 'Academic Research Report',
      description: 'Standard academic research report with APA formatting',
      format: 'academic',
      citationStyle: 'apa',
      sections: [
        { id: 'cover', title: 'Cover Page', content: '', required: true, completed: false, wordCount: 0, order: 1 },
        { id: 'abstract', title: 'Abstract', content: '', required: true, completed: false, wordCount: 0, order: 2 },
        { id: 'toc', title: 'Table of Contents', content: '', required: true, completed: false, wordCount: 0, order: 3 },
        { id: 'introduction', title: 'Introduction', content: '', required: true, completed: false, wordCount: 0, order: 4 },
        { id: 'literature', title: 'Literature Review', content: '', required: true, completed: false, wordCount: 0, order: 5 },
        { id: 'methodology', title: 'Methodology', content: '', required: true, completed: false, wordCount: 0, order: 6 },
        { id: 'results', title: 'Results', content: '', required: true, completed: false, wordCount: 0, order: 7 },
        { id: 'discussion', title: 'Discussion', content: '', required: true, completed: false, wordCount: 0, order: 8 },
        { id: 'conclusion', title: 'Conclusion', content: '', required: true, completed: false, wordCount: 0, order: 9 },
        { id: 'references', title: 'References', content: '', required: true, completed: false, wordCount: 0, order: 10 }
      ]
    },
    {
      id: 'business',
      name: 'Business Report',
      description: 'Professional business report with executive summary and recommendations',
      format: 'business',
      citationStyle: 'apa',
      sections: [
        { id: 'cover', title: 'Cover Page', content: '', required: true, completed: false, wordCount: 0, order: 1 },
        { id: 'executive', title: 'Executive Summary', content: '', required: true, completed: false, wordCount: 0, order: 2 },
        { id: 'toc', title: 'Table of Contents', content: '', required: true, completed: false, wordCount: 0, order: 3 },
        { id: 'introduction', title: 'Introduction', content: '', required: true, completed: false, wordCount: 0, order: 4 },
        { id: 'analysis', title: 'Analysis', content: '', required: true, completed: false, wordCount: 0, order: 5 },
        { id: 'findings', title: 'Findings', content: '', required: true, completed: false, wordCount: 0, order: 6 },
        { id: 'recommendations', title: 'Recommendations', content: '', required: true, completed: false, wordCount: 0, order: 7 },
        { id: 'conclusion', title: 'Conclusion', content: '', required: true, completed: false, wordCount: 0, order: 8 },
        { id: 'references', title: 'References', content: '', required: true, completed: false, wordCount: 0, order: 9 }
      ]
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reportData.template) {
      const template = templates.find(t => t.id === reportData.template);
      if (template) {
        setSelectedTemplate(template);
        setReportData(prev => ({
          ...prev,
          sections: template.sections,
          citationStyle: template.citationStyle
        }));
      }
    }
  }, [reportData.template, templates]);

  const handleInputChange = (field: keyof ReportData, value: any) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionContentChange = (sectionId: string, content: string) => {
    setReportData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              content, 
              wordCount: content.split(' ').filter(word => word.length > 0).length,
              completed: content.trim().length > 0
            }
          : section
      )
    }));
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !reportData.keywords.includes(keyword.trim())) {
      setReportData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }));
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setReportData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const generateReport = async (format: 'pdf' | 'docx' | 'html') => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate report generation progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsGenerating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Here you would implement actual report generation
      // This could involve calling a backend service that generates the report
      // in the requested format using libraries like Puppeteer (PDF) or docx (Word)
      
      console.log('Generating report in format:', format);
      console.log('Report data:', reportData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!selectedTemplate) return 0;
    const completedSections = reportData.sections.filter(section => section.completed).length;
    return Math.round((completedSections / selectedTemplate.sections.length) * 100);
  };

  const getRequiredSectionsCompletion = () => {
    if (!selectedTemplate) return 0;
    const requiredSections = selectedTemplate.sections.filter(section => section.required);
    const completedRequired = reportData.sections.filter(section => 
      section.required && section.completed
    ).length;
    return Math.round((completedRequired / requiredSections.length) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Legal Report Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create professional legal reports with proper formatting and citations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Report Template</Label>
                <Select 
                  value={reportData.template} 
                  onValueChange={(value) => handleInputChange('template', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Output Format</Label>
                <Select 
                  value={reportData.format} 
                  onValueChange={(value) => handleInputChange('format', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        PDF Document
                      </div>
                    </SelectItem>
                    <SelectItem value="docx">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Word Document
                      </div>
                    </SelectItem>
                    <SelectItem value="html">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4" />
                        HTML Document
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="citation">Citation Style</Label>
                <Select 
                  value={reportData.citationStyle} 
                  onValueChange={(value) => handleInputChange('citationStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select citation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bluebook">Bluebook (Legal)</SelectItem>
                    <SelectItem value="apa">APA (Academic)</SelectItem>
                    <SelectItem value="mla">MLA (General)</SelectItem>
                    <SelectItem value="oscola">OSCOLA (UK Legal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{getCompletionPercentage()}%</span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Required Sections</span>
                  <span>{getRequiredSectionsCompletion()}%</span>
                </div>
                <Progress value={getRequiredSectionsCompletion()} className="h-2" />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Completed: {reportData.sections.filter(s => s.completed).length} / {reportData.sections.length}</p>
                <p>Required: {reportData.sections.filter(s => s.required && s.completed).length} / {reportData.sections.filter(s => s.required).length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={reportData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter report title"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={reportData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={reportData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    placeholder="Enter student ID"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={reportData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor">Supervisor Name</Label>
                  <Input
                    id="supervisor"
                    value={reportData.supervisor}
                    onChange={(e) => handleInputChange('supervisor', e.target.value)}
                    placeholder="Enter supervisor name"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisorTitle">Supervisor Title</Label>
                  <Input
                    id="supervisorTitle"
                    value={reportData.supervisorTitle}
                    onChange={(e) => handleInputChange('supervisorTitle', e.target.value)}
                    placeholder="Enter supervisor title"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={reportData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={reportData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="Enter university name"
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={reportData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    placeholder="Enter degree"
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={reportData.field}
                    onChange={(e) => handleInputChange('field', e.target.value)}
                    placeholder="Enter field of study"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abstract and Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Abstract & Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  value={reportData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  placeholder="Enter abstract (250-300 words)"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Word count: {reportData.abstract.split(' ').filter(word => word.length > 0).length}
                </p>
              </div>
              
              <div>
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reportData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        onClick={() => handleKeywordRemove(keyword)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add keyword"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleKeywordAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add keyword"]') as HTMLInputElement;
                      if (input) {
                        handleKeywordAdd(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{section.title}</h3>
                        {section.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {section.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {section.wordCount} words
                      </div>
                    </div>
                    
                    <Textarea
                      value={section.content}
                      onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
                      placeholder={`Enter content for ${section.title}...`}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating report...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => generateReport('pdf')}
                    disabled={isGenerating || getRequiredSectionsCompletion() < 100}
                    className="flex-1"
                  >
                    <File className="h-4 w-4 mr-2" />
                    Generate PDF
                  </Button>
                  <Button
                    onClick={() => generateReport('docx')}
                    disabled={isGenerating || getRequiredSectionsCompletion() < 100}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Word
                  </Button>
                  <Button
                    onClick={() => generateReport('html')}
                    disabled={isGenerating || getRequiredSectionsCompletion() < 100}
                    className="flex-1"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Generate HTML
                  </Button>
                </div>
                
                {getRequiredSectionsCompletion() < 100 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    Complete all required sections to generate report
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Export is now at the top of the file
