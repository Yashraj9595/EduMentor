// Report Generation Service
// Handles the generation of legal reports in multiple formats (PDF, DOCX, HTML)

export interface ReportData {
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

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  completed: boolean;
  wordCount: number;
  order: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'legal' | 'academic' | 'business';
  citationStyle: 'bluebook' | 'apa' | 'mla' | 'oscola';
}

export class ReportService {
  private static instance: ReportService;
  
  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  /**
   * Generate report in specified format
   */
  async generateReport(data: ReportData, format: 'pdf' | 'docx' | 'html'): Promise<Blob> {
    try {
      switch (format) {
        case 'pdf':
          return await this.generatePDF(data);
        case 'docx':
          return await this.generateDOCX(data);
        case 'html':
          return await this.generateHTML(data);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Generate PDF report using Puppeteer
   */
  private async generatePDF(data: ReportData): Promise<Blob> {
    const htmlContent = this.generateHTMLContent(data);
    
    // In a real implementation, you would use Puppeteer to generate PDF
    // For now, we'll simulate the process
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: htmlContent,
        options: {
          format: 'A4',
          margin: {
            top: '1in',
            right: '1in',
            bottom: '1in',
            left: '1in'
          },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: this.generateHeaderTemplate(data),
          footerTemplate: this.generateFooterTemplate()
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return await response.blob();
  }

  /**
   * Generate DOCX report using docx library
   */
  private async generateDOCX(data: ReportData): Promise<Blob> {
    const response = await fetch('/api/generate-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data,
        template: data.template,
        citationStyle: data.citationStyle
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate DOCX');
    }

    return await response.blob();
  }

  /**
   * Generate HTML report
   */
  private async generateHTML(data: ReportData): Promise<Blob> {
    const htmlContent = this.generateHTMLContent(data);
    return new Blob([htmlContent], { type: 'text/html' });
  }

  /**
   * Generate HTML content for the report
   */
  private generateHTMLContent(data: ReportData): string {
    const template = this.getTemplate(data.template);
    if (!template) {
      throw new Error(`Template not found: ${data.template}`);
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        ${this.getCSSStyles(data.citationStyle)}
    </style>
</head>
<body>
    ${this.generateCoverPage(data)}
    ${this.generateDeclaration(data)}
    ${this.generateAcknowledgements(data)}
    ${this.generateAbstract(data)}
    ${this.generateTableOfContents(data)}
    ${this.generateSections(data)}
    ${this.generateReferences(data)}
    ${this.generateAppendices(data)}
</body>
</html>`;
  }

  /**
   * Generate cover page HTML
   */
  private generateCoverPage(data: ReportData): string {
    return `
    <div class="cover-page">
        <div class="university-info">
            <h1>${data.university}</h1>
            <h2>${data.department}</h2>
            <h3>${data.degree}</h3>
        </div>
        
        <div class="title-section">
            <h1 class="report-title">${data.title}</h1>
            <p class="subtitle">A Legal Analysis of [SPECIFIC LEGAL TOPIC]</p>
        </div>
        
        <div class="submission-info">
            <p>Submitted in Partial Fulfillment of the Requirements for the Degree of</p>
            <h3>${data.degree}</h3>
            <p>in</p>
            <h3>${data.field}</h3>
        </div>
        
        <div class="author-info">
            <p><strong>By</strong></p>
            <h3>${data.author}</h3>
            <p>Student ID: ${data.studentId}</p>
            <p>Email: ${data.email}</p>
        </div>
        
        <div class="supervisor-info">
            <p><strong>Under the Supervision of</strong></p>
            <h3>${data.supervisor}</h3>
            <p>${data.supervisorTitle}</p>
            <p>${data.department}</p>
        </div>
        
        <div class="university-footer">
            <h3>${data.university}</h3>
            <p>${data.city}, ${data.country}</p>
            <p>${data.date}</p>
        </div>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate declaration HTML
   */
  private generateDeclaration(data: ReportData): string {
    return `
    <div class="declaration-page">
        <h1>DECLARATION</h1>
        <p>I, <strong>${data.author}</strong>, hereby declare that:</p>
        <ol>
            <li>This project report titled "<strong>${data.title}</strong>" is my original work and has not been submitted for any degree or diploma at any other university or institution.</li>
            <li>All sources of information used in this report have been duly acknowledged and cited according to the prescribed legal citation format.</li>
            <li>No part of this report has been copied from any other work without proper attribution and citation.</li>
            <li>The work presented herein represents my independent research and analysis conducted under the guidance of my supervisor.</li>
            <li>I understand that any form of plagiarism or academic dishonesty will result in disciplinary action as per the university's academic integrity policy.</li>
            <li>All data, statistics, and legal precedents cited in this report are accurate to the best of my knowledge and have been verified from reliable legal sources.</li>
            <li>This report complies with all ethical guidelines and legal research standards as prescribed by the university and the legal profession.</li>
        </ol>
        
        <div class="signature-section">
            <p><strong>Student Signature:</strong> _________________________ <strong>Date:</strong> _______________</p>
            <p><strong>${data.author}</strong></p>
            <p><strong>${data.studentId}</strong></p>
        </div>
        
        <div class="supervisor-declaration">
            <h3>Supervisor's Declaration:</h3>
            <p>I hereby certify that the above declaration is true and that the student has completed this project under my supervision.</p>
            <p><strong>Supervisor Signature:</strong> _________________________ <strong>Date:</strong> _______________</p>
            <p><strong>${data.supervisor}</strong></p>
            <p><strong>${data.supervisorTitle}</strong></p>
        </div>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate acknowledgements HTML
   */
  private generateAcknowledgements(data: ReportData): string {
    return `
    <div class="acknowledgements-page">
        <h1>ACKNOWLEDGEMENTS</h1>
        <p>I would like to express my sincere gratitude to all those who have contributed to the successful completion of this project report.</p>
        
        <p>First and foremost, I am deeply grateful to my supervisor, <strong>${data.supervisor}</strong>, ${data.supervisorTitle}, for their invaluable guidance, constructive feedback, and continuous support throughout this research journey. Their expertise in [RELEVANT FIELD] and insightful suggestions have been instrumental in shaping this work.</p>
        
        <p>I extend my heartfelt thanks to the faculty members of the ${data.department} at ${data.university} for their academic guidance and for providing a stimulating learning environment that has enhanced my understanding of legal research and analysis.</p>
        
        <p>I am grateful to the librarians and staff of the [LIBRARY NAME] for their assistance in accessing legal databases, journals, and other research materials essential for this study.</p>
        
        <p>Special thanks to my fellow students and colleagues who have provided valuable discussions and insights during the course of this research. Their diverse perspectives have enriched my understanding of the subject matter.</p>
        
        <p>I would also like to acknowledge the legal professionals, practitioners, and experts who generously shared their time and expertise through interviews and consultations, providing practical insights that have enhanced the practical relevance of this research.</p>
        
        <p>My sincere appreciation goes to my family and friends for their unwavering support, encouragement, and understanding during the challenging periods of this research process.</p>
        
        <p>Finally, I acknowledge the authors, researchers, and legal scholars whose works have formed the foundation of this research. Their contributions to the field of [LEGAL FIELD] have provided the theoretical framework and empirical evidence that made this study possible.</p>
        
        <p>Any errors or omissions in this work remain entirely my own responsibility.</p>
        
        <div class="signature-section">
            <p><strong>${data.author}</strong></p>
            <p><strong>${data.date}</strong></p>
        </div>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate abstract HTML
   */
  private generateAbstract(data: ReportData): string {
    return `
    <div class="abstract-page">
        <h1>ABSTRACT</h1>
        <h2>${data.title}</h2>
        <p><strong>Keywords:</strong> ${data.keywords.join(', ')}</p>
        
        <div class="abstract-content">
            <p>${data.abstract}</p>
        </div>
        
        <p><strong>Word Count:</strong> ${data.abstract.split(' ').filter(word => word.length > 0).length}</p>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate table of contents HTML
   */
  private generateTableOfContents(data: ReportData): string {
    const sections = data.sections.filter(section => section.content.trim().length > 0);
    
    return `
    <div class="toc-page">
        <h1>TABLE OF CONTENTS</h1>
        <div class="toc-content">
            <p><strong>PAGE</strong></p>
            <p><strong>ABSTRACT</strong> ........................................................................... iv</p>
            <p><strong>ACKNOWLEDGEMENTS</strong> ........................................................... v</p>
            <p><strong>TABLE OF CONTENTS</strong> ............................................................ vi</p>
            <p><strong>LIST OF TABLES</strong> ................................................................ vii</p>
            <p><strong>LIST OF FIGURES</strong> .............................................................. viii</p>
            <p><strong>LIST OF ABBREVIATIONS</strong> ....................................................... ix</p>
            
            ${sections.map((section, index) => `
                <p><strong>${section.title}</strong> ...................................................... ${index + 1}</p>
            `).join('')}
            
            <p><strong>REFERENCES</strong> ................................................................... ${sections.length + 1}</p>
            <p><strong>APPENDICES</strong> ................................................................... ${sections.length + 2}</p>
        </div>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate sections HTML
   */
  private generateSections(data: ReportData): string {
    return data.sections
      .filter(section => section.content.trim().length > 0)
      .map((section, index) => `
        <div class="section">
            <h1>${section.title}</h1>
            <div class="section-content">
                ${section.content.split('\n').map(paragraph => 
                  paragraph.trim() ? `<p>${paragraph}</p>` : ''
                ).join('')}
            </div>
        </div>
        <div class="page-break"></div>
      `).join('');
  }

  /**
   * Generate references HTML
   */
  private generateReferences(data: ReportData): string {
    return `
    <div class="references-page">
        <h1>REFERENCES</h1>
        <div class="references-content">
            <p>References will be automatically generated based on the citation style: ${data.citationStyle.toUpperCase()}</p>
            <!-- In a real implementation, you would parse citations from the content and format them according to the citation style -->
        </div>
    </div>
    <div class="page-break"></div>`;
  }

  /**
   * Generate appendices HTML
   */
  private generateAppendices(data: ReportData): string {
    return `
    <div class="appendices-page">
        <h1>APPENDICES</h1>
        <div class="appendices-content">
            <p>Appendices will be included here if any supporting materials are provided.</p>
        </div>
    </div>`;
  }

  /**
   * Generate header template for PDF
   */
  private generateHeaderTemplate(data: ReportData): string {
    return `
    <div style="font-size: 10px; text-align: center; width: 100%;">
        ${data.title}
    </div>`;
  }

  /**
   * Generate footer template for PDF
   */
  private generateFooterTemplate(): string {
    return `
    <div style="font-size: 10px; text-align: center; width: 100%;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>`;
  }

  /**
   * Get CSS styles based on citation style
   */
  private getCSSStyles(citationStyle: string): string {
    const baseStyles = `
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        
        .cover-page {
            text-align: center;
            page-break-after: always;
            padding: 2in;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        h1 {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 12pt;
        }
        
        h2 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10pt;
        }
        
        h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 8pt;
        }
        
        p {
            margin-bottom: 6pt;
            text-align: justify;
        }
        
        .section {
            margin-bottom: 20pt;
        }
        
        .toc-content p {
            margin-bottom: 3pt;
        }
        
        .signature-section {
            margin-top: 20pt;
        }
        
        .abstract-content {
            margin: 20pt 0;
        }
        
        .references-content {
            margin: 20pt 0;
        }
        
        .appendices-content {
            margin: 20pt 0;
        }
    `;

    // Add citation-specific styles
    const citationStyles = {
      bluebook: `
        .citation {
            font-style: italic;
        }
        .case-name {
            font-style: italic;
        }
        .statute-title {
            font-weight: bold;
        }
      `,
      apa: `
        .citation {
            font-style: normal;
        }
        .author-name {
            font-weight: bold;
        }
        .publication-year {
            font-weight: bold;
        }
      `,
      mla: `
        .citation {
            font-style: normal;
        }
        .author-name {
            font-weight: bold;
        }
        .title {
            font-style: italic;
        }
      `,
      oscola: `
        .citation {
            font-style: normal;
        }
        .case-name {
            font-style: italic;
        }
        .statute-title {
            font-weight: bold;
        }
      `
    };

    return baseStyles + (citationStyles[citationStyle as keyof typeof citationStyles] || '');
  }

  /**
   * Get template by ID
   */
  private getTemplate(templateId: string): ReportTemplate | null {
    // In a real implementation, you would fetch this from a database
    // For now, return null as templates are managed in the component
    return null;
  }

  /**
   * Download generated report
   */
  async downloadReport(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate report data
   */
  validateReportData(data: ReportData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title.trim()) {
      errors.push('Report title is required');
    }

    if (!data.author.trim()) {
      errors.push('Author name is required');
    }

    if (!data.supervisor.trim()) {
      errors.push('Supervisor name is required');
    }

    if (!data.abstract.trim()) {
      errors.push('Abstract is required');
    }

    if (data.abstract.split(' ').filter(word => word.length > 0).length < 100) {
      errors.push('Abstract must be at least 100 words');
    }

    if (data.abstract.split(' ').filter(word => word.length > 0).length > 500) {
      errors.push('Abstract must not exceed 500 words');
    }

    const requiredSections = data.sections.filter(section => section.required);
    const completedRequired = data.sections.filter(section => 
      section.required && section.completed
    );

    if (completedRequired.length < requiredSections.length) {
      errors.push('All required sections must be completed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ReportService;
