import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { ReportData, ReportSection } from '../types/report.types';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  /**
   * Generate report in specified format
   */
  public generateReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, format } = req.body;
      
      if (!data || !format) {
        res.status(400).json({
          success: false,
          message: 'Report data and format are required'
        });
        return;
      }

      // Validate report data
      const validation = this.reportService.validateReportData(data);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid report data',
          errors: validation.errors
        });
        return;
      }

      // Generate report
      const reportBlob = await this.reportService.generateReport(data, format);
      
      // Set appropriate headers
      const contentType = this.getContentType(format);
      const filename = this.generateFilename(data.title, format);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', reportBlob.size);
      
      // Send the report
      res.send(Buffer.from(await reportBlob.arrayBuffer()));
      
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get available report templates
   */
  public getTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await this.reportService.getTemplates();
      
      res.json({
        success: true,
        data: templates
      });
      
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get template by ID
   */
  public getTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId } = req.params;
      
      if (!templateId) {
        res.status(400).json({
          success: false,
          message: 'Template ID is required'
        });
        return;
      }

      const template = await this.reportService.getTemplate(templateId);
      
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Template not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: template
      });
      
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Save report draft
   */
  public saveDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data, userId } = req.body;
      
      if (!data || !userId) {
        res.status(400).json({
          success: false,
          message: 'Report data and user ID are required'
        });
        return;
      }

      const draft = await this.reportService.saveDraft(data, userId);
      
      res.json({
        success: true,
        data: draft,
        message: 'Draft saved successfully'
      });
      
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save draft',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Load report draft
   */
  public loadDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const { draftId } = req.params;
      const { userId } = req.body;
      
      if (!draftId || !userId) {
        res.status(400).json({
          success: false,
          message: 'Draft ID and user ID are required'
        });
        return;
      }

      const draft = await this.reportService.loadDraft(draftId, userId);
      
      if (!draft) {
        res.status(404).json({
          success: false,
          message: 'Draft not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: draft
      });
      
    } catch (error) {
      console.error('Error loading draft:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load draft',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get user's report drafts
   */
  public getUserDrafts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const drafts = await this.reportService.getUserDrafts(userId);
      
      res.json({
        success: true,
        data: drafts
      });
      
    } catch (error) {
      console.error('Error fetching user drafts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch drafts',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Delete report draft
   */
  public deleteDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const { draftId } = req.params;
      const { userId } = req.body;
      
      if (!draftId || !userId) {
        res.status(400).json({
          success: false,
          message: 'Draft ID and user ID are required'
        });
        return;
      }

      const deleted = await this.reportService.deleteDraft(draftId, userId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Draft not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Draft deleted successfully'
      });
      
    } catch (error) {
      console.error('Error deleting draft:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete draft',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Validate report data
   */
  public validateReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data } = req.body;
      
      if (!data) {
        res.status(400).json({
          success: false,
          message: 'Report data is required'
        });
        return;
      }

      const validation = this.reportService.validateReportData(data);
      
      res.json({
        success: true,
        data: validation
      });
      
    } catch (error) {
      console.error('Error validating report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate report',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get report statistics
   */
  public getReportStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { data } = req.body;
      
      if (!data) {
        res.status(400).json({
          success: false,
          message: 'Report data is required'
        });
        return;
      }

      const stats = this.reportService.getReportStats(data);
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      console.error('Error getting report stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get report statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get content type for format
   */
  private getContentType(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'html':
        return 'text/html';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Generate filename for report
   */
  private generateFilename(title: string, format: string): string {
    const sanitizedTitle = title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `${sanitizedTitle}_${timestamp}.${format}`;
  }
}

export default ReportController;
