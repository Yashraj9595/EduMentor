import { ReportData, ReportSection, ReportTemplate } from '../types/report.types';
import { ReportDraft, IReportDraft } from '../models/ReportDraft';
import { User } from '../models/User';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

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
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
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
      });
      
      return new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' });
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate DOCX report using docx library
   */
  private async generateDOCX(data: ReportData): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Cover Page
          new Paragraph({
            children: [
              new TextRun({
                text: data.university,
                bold: true,
                size: 32
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.department,
                size: 24
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.degree,
                size: 24
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 28
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `By ${data.author}`,
                size: 20
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Student ID: ${data.studentId}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${data.email}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Under the Supervision of ${data.supervisor}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.supervisorTitle}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.department}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.university}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.city}, ${data.country}`,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.date,
                size: 16
              })
            ],
            alignment: 'center'
          }),
          
          // Abstract
          new Paragraph({
            children: [
              new TextRun({
                text: 'ABSTRACT',
                bold: true,
                size: 24
              })
            ],
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 18
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Keywords: ${data.keywords.join(', ')}`,
                size: 14
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.abstract,
                size: 12
              })
            ]
          }),
          
          // Sections
          ...data.sections
            .filter(section => section.content.trim().length > 0)
            .map(section => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 16
                  })
                ],
                heading: HeadingLevel.HEADING_1
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.content,
                    size: 12
                  })
                ]
              })
            ])
            .flat()
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    return new Blob([new Uint8Array(buffer)], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
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
   * Get available templates
   */
  async getTemplates(): Promise<ReportTemplate[]> {
    // In a real implementation, you would fetch this from a database
    return [
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
      }
    ];
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<ReportTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find(template => template.id === templateId) || null;
  }

  /**
   * Save report draft
   */
  async saveDraft(data: ReportData, userId: string): Promise<IReportDraft> {
    const draft = new ReportDraft({
      userId,
      title: data.title,
      data: JSON.stringify(data),
      template: data.template,
      format: data.format,
      citationStyle: data.citationStyle,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await draft.save();
  }

  /**
   * Load report draft
   */
  async loadDraft(draftId: string, userId: string): Promise<IReportDraft | null> {
    return await ReportDraft.findOne({ _id: draftId, userId });
  }

  /**
   * Get user's report drafts
   */
  async getUserDrafts(userId: string): Promise<IReportDraft[]> {
    return await ReportDraft.find({ userId }).sort({ updatedAt: -1 });
  }

  /**
   * Delete report draft
   */
  async deleteDraft(draftId: string, userId: string): Promise<boolean> {
    const result = await ReportDraft.deleteOne({ _id: draftId, userId });
    return result.deletedCount > 0;
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

  /**
   * Get report statistics
   */
  getReportStats(data: ReportData): {
    totalWords: number;
    totalSections: number;
    completedSections: number;
    requiredSections: number;
    completedRequired: number;
    completionPercentage: number;
    requiredCompletionPercentage: number;
  } {
    const totalWords = data.sections.reduce((sum, section) => sum + section.wordCount, 0);
    const totalSections = data.sections.length;
    const completedSections = data.sections.filter(section => section.completed).length;
    const requiredSections = data.sections.filter(section => section.required).length;
    const completedRequired = data.sections.filter(section => 
      section.required && section.completed
    ).length;

    return {
      totalWords,
      totalSections,
      completedSections,
      requiredSections,
      completedRequired,
      completionPercentage: Math.round((completedSections / totalSections) * 100),
      requiredCompletionPercentage: Math.round((completedRequired / requiredSections) * 100)
    };
  }
}

export default ReportService;
