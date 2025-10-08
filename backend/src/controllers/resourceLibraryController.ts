import { Request, Response } from 'express';
import { Resource, ResourceRating, ResourceDownload } from '../models/ResourceLibrary';
import { User } from '../models/User';
import { IAuthRequest } from '../types';

export class ResourceLibraryController {
  /**
   * Upload a new resource
   */
  static async uploadResource(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const {
        title,
        description,
        category,
        type,
        fileUrl,
        externalUrl,
        content,
        tags,
        isPublic,
        relatedSkills,
        difficultyLevel
      } = req.body;

      // Validate required fields
      if (!title || !description || !category || !type) {
        res.status(400).json({
          success: false,
          message: 'Title, description, category, and type are required'
        });
        return;
      }

      // Create new resource
      const resource = new Resource({
        title,
        description,
        category,
        type,
        fileUrl,
        externalUrl,
        content,
        tags: tags || [],
        author: userId,
        isPublic: isPublic !== undefined ? isPublic : false,
        relatedSkills: relatedSkills || [],
        difficultyLevel: difficultyLevel || 'intermediate'
      });

      await resource.save();

      // Populate author information
      await resource.populate('author', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Resource uploaded successfully',
        data: resource
      });
    } catch (error) {
      console.error('Upload resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload resource'
      });
    }
  }

  /**
   * Get all resources with filtering and pagination
   */
  static async getResources(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const {
        category,
        type,
        search,
        tags,
        difficultyLevel,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      // Build filter object
      const filter: any = { isPublic: true }; // Only public resources for now

      if (category && category !== 'all') {
        filter.category = category;
      }

      if (type && type !== 'all') {
        filter.type = type;
      }

      if (difficultyLevel && difficultyLevel !== 'all') {
        filter.difficultyLevel = difficultyLevel;
      }

      if (search) {
        filter.$text = { $search: search as string };
      }

      if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : [tags];
        filter.tags = { $in: tagsArray };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (Number(page) - 1) * Number(limit);

      // Execute query
      const [resources, total] = await Promise.all([
        Resource.find(filter)
          .populate('author', 'firstName lastName email')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit)),
        Resource.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / Number(limit));

      res.json({
        success: true,
        message: 'Resources retrieved successfully',
        data: {
          resources,
          pagination: {
            currentPage: Number(page),
            totalPages,
            total,
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Get resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resources'
      });
    }
  }

  /**
   * Get a specific resource by ID
   */
  static async getResourceById(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const resource = await Resource.findById(id)
        .populate('author', 'firstName lastName email');

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      // Increment view count
      resource.views += 1;
      await resource.save();

      res.json({
        success: true,
        message: 'Resource retrieved successfully',
        data: resource
      });
    } catch (error) {
      console.error('Get resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resource'
      });
    }
  }

  /**
   * Update a resource
   */
  static async updateResource(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const resource = await Resource.findById(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      // Check if user is the author
      if (resource.author.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to update this resource'
        });
        return;
      }

      const {
        title,
        description,
        category,
        type,
        fileUrl,
        externalUrl,
        content,
        tags,
        isPublic,
        relatedSkills,
        difficultyLevel
      } = req.body;

      // Update fields if provided
      if (title !== undefined) resource.title = title;
      if (description !== undefined) resource.description = description;
      if (category !== undefined) resource.category = category;
      if (type !== undefined) resource.type = type;
      if (fileUrl !== undefined) resource.fileUrl = fileUrl;
      if (externalUrl !== undefined) resource.externalUrl = externalUrl;
      if (content !== undefined) resource.content = content;
      if (tags !== undefined) resource.tags = tags;
      if (isPublic !== undefined) resource.isPublic = isPublic;
      if (relatedSkills !== undefined) resource.relatedSkills = relatedSkills;
      if (difficultyLevel !== undefined) resource.difficultyLevel = difficultyLevel;

      await resource.save();

      // Populate author information
      await resource.populate('author', 'firstName lastName email');

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: resource
      });
    } catch (error) {
      console.error('Update resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update resource'
      });
    }
  }

  /**
   * Delete a resource
   */
  static async deleteResource(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const resource = await Resource.findById(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      // Check if user is the author or admin
      const user = await User.findById(userId);
      if (resource.author.toString() !== userId && user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'You do not have permission to delete this resource'
        });
        return;
      }

      await Resource.findByIdAndDelete(id);

      // Also delete related ratings and downloads
      await ResourceRating.deleteMany({ resourceId: id });
      await ResourceDownload.deleteMany({ resourceId: id });

      res.json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } catch (error) {
      console.error('Delete resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete resource'
      });
    }
  }

  /**
   * Get resources by author (mentor's own resources)
   */
  static async getMyResources(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const resources = await Resource.find({ author: userId })
        .populate('author', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Your resources retrieved successfully',
        data: resources
      });
    } catch (error) {
      console.error('Get my resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve your resources'
      });
    }
  }

  /**
   * Rate a resource
   */
  static async rateResource(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
        return;
      }

      // Check if resource exists
      const resource = await Resource.findById(id);
      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      // Create or update rating
      const resourceRating = await ResourceRating.findOneAndUpdate(
        { resourceId: id, userId },
        { resourceId: id, userId, rating, comment },
        { new: true, upsert: true, runValidators: true }
      );

      // Calculate average rating for the resource
      const ratings = await ResourceRating.find({ resourceId: id });
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      res.json({
        success: true,
        message: 'Resource rated successfully',
        data: {
          rating: resourceRating,
          averageRating: Math.round(avgRating * 10) / 10 // Round to 1 decimal place
        }
      });
    } catch (error) {
      console.error('Rate resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to rate resource'
      });
    }
  }

  /**
   * Get ratings for a resource
   */
  static async getResourceRatings(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if resource exists
      const resource = await Resource.findById(id);
      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      const ratings = await ResourceRating.find({ resourceId: id })
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        message: 'Resource ratings retrieved successfully',
        data: ratings
      });
    } catch (error) {
      console.error('Get resource ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resource ratings'
      });
    }
  }

  /**
   * Download a resource
   */
  static async downloadResource(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const resource = await Resource.findById(id);

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;
      }

      // Increment download count
      resource.downloads += 1;
      await resource.save();

      // Record download
      const download = new ResourceDownload({
        resourceId: id,
        userId
      });

      await download.save();

      res.json({
        success: true,
        message: 'Resource download recorded',
        data: {
          downloadUrl: resource.fileUrl || resource.externalUrl,
          resource
        }
      });
    } catch (error) {
      console.error('Download resource error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download resource'
      });
    }
  }

  /**
   * Get popular resources
   */
  static async getPopularResources(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const resources = await Resource.find({ isPublic: true })
        .populate('author', 'firstName lastName email')
        .sort({ downloads: -1, views: -1 })
        .limit(Number(limit));

      res.json({
        success: true,
        message: 'Popular resources retrieved successfully',
        data: resources
      });
    } catch (error) {
      console.error('Get popular resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve popular resources'
      });
    }
  }

  /**
   * Get featured resources
   */
  static async getFeaturedResources(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { limit = 5 } = req.query;

      // Featured resources are those with high ratings and downloads
      const resources = await Resource.find({ isPublic: true })
        .populate('author', 'firstName lastName email')
        .sort({ rating: -1, downloads: -1 })
        .limit(Number(limit));

      res.json({
        success: true,
        message: 'Featured resources retrieved successfully',
        data: resources
      });
    } catch (error) {
      console.error('Get featured resources error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured resources'
      });
    }
  }
}