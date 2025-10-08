import { Request, Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest } from '../types';
import { Types } from 'mongoose';
import XLSX from 'xlsx';

interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  university?: string;
  major?: string;
  year?: string;
  studentId?: string;
  graduationYear?: string;
  department?: string; // For mentors
  bio?: string; // For mentors
  skills?: string[]; // For mentors
}

// Email validation regex
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// Mobile validation regex (international format)
const MOBILE_REGEX = /^\+?[1-9]\d{1,14}$/;

export class InstitutionController {
  /**
   * Create a single user account (Student or Mentor)
   * Institution admins can create accounts for their institution
   */
  static async createAccount(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can create accounts'
        });
        return;
      }

      const {
        firstName,
        lastName,
        email,
        mobile,
        role,
        university,
        major,
        year,
        studentId,
        graduationYear,
        department, // For mentors
        bio, // For mentors
        skills // For mentors
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !mobile || !role) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: firstName, lastName, email, mobile, role'
        });
        return;
      }

      // Validate email format
      if (!EMAIL_REGEX.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
        return;
      }

      // Validate mobile format
      if (!MOBILE_REGEX.test(mobile)) {
        res.status(400).json({
          success: false,
          message: 'Invalid mobile number format'
        });
        return;
      }

      // Validate role (only students and mentors can be created by institutions)
      if (role !== 'student' && role !== 'mentor') {
        res.status(400).json({
          success: false,
          message: 'Role must be either student or mentor'
        });
        return;
      }

      // Validate name lengths
      if (firstName.length < 2 || firstName.length > 50) {
        res.status(400).json({
          success: false,
          message: 'First name must be between 2 and 50 characters'
        });
        return;
      }

      if (lastName.length < 2 || lastName.length > 50) {
        res.status(400).json({
          success: false,
          message: 'Last name must be between 2 and 50 characters'
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
        return;
      }

      // For institution admins, ensure accounts are created under their institution
      let userUniversity = university;
      if (req.user?.role === 'institution') {
        // Institution admins can only create accounts for their own institution
        userUniversity = req.user.university;
        
        // If university was provided in request and doesn't match institution admin's university, reject
        if (university && university !== req.user.university) {
          res.status(403).json({
            success: false,
            message: 'Institution admins can only create accounts for their own institution'
          });
          return;
        }
      }

      // Create new user with a temporary password
      // In a real implementation, you might want to send an email with a password reset link
      const temporaryPassword = Math.random().toString(36).slice(-8);
      
      const userData: any = {
        email,
        password: temporaryPassword,
        firstName,
        lastName,
        mobile,
        role,
        isEmailVerified: false,
        isMobileVerified: false,
        isActive: true
      };

      // Add student/mentor specific fields with validation
      if (userUniversity) {
        if (userUniversity.length > 100) {
          res.status(400).json({
            success: false,
            message: 'University name cannot exceed 100 characters'
          });
          return;
        }
        userData.university = userUniversity;
      }
      
      // For students
      if (role === 'student') {
        if (major) {
          if (major.length > 100) {
            res.status(400).json({
              success: false,
              message: 'Major cannot exceed 100 characters'
            });
            return;
          }
          userData.major = major;
        }
        
        if (year) {
          if (year.length > 20) {
            res.status(400).json({
              success: false,
              message: 'Year cannot exceed 20 characters'
            });
            return;
          }
          userData.year = year;
        }
        
        if (studentId) {
          if (studentId.length > 50) {
            res.status(400).json({
              success: false,
              message: 'Student ID cannot exceed 50 characters'
            });
            return;
          }
          userData.studentId = studentId;
        }
        
        if (graduationYear) {
          if (graduationYear.length > 4) {
            res.status(400).json({
              success: false,
              message: 'Graduation year cannot exceed 4 characters'
            });
            return;
          }
          userData.graduationYear = graduationYear;
        }
      }
      
      // For mentors
      if (role === 'mentor') {
        if (department) {
          if (department.length > 100) {
            res.status(400).json({
              success: false,
              message: 'Department cannot exceed 100 characters'
            });
            return;
          }
          userData.department = department;
        }
        
        if (bio) {
          if (bio.length > 500) {
            res.status(400).json({
              success: false,
              message: 'Bio cannot exceed 500 characters'
            });
            return;
          }
          userData.bio = bio;
        }
        
        if (skills && Array.isArray(skills)) {
          // Limit to 20 skills max
          if (skills.length > 20) {
            res.status(400).json({
              success: false,
              message: 'Cannot have more than 20 skills'
            });
            return;
          }
          
          // Validate each skill
          const validatedSkills = skills.filter((skill: any) => 
            typeof skill === 'string' && skill.length > 0 && skill.length <= 50
          );
          
          userData.skills = validatedSkills;
        }
      }

      const user = await User.create(userData);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            university: user.university,
            major: user.major,
            year: user.year,
            studentId: user.studentId,
            graduationYear: user.graduationYear,
            department: user.department,
            bio: user.bio
          }
        }
      });
    } catch (error: any) {
      console.error('Create account error:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email or mobile number'
        });
        return;
      }
      
      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create account'
      });
    }
  }

  /**
   * Create multiple accounts from bulk upload
   * Expects an Excel file upload
   */
  static async createBulkAccounts(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can create accounts'
        });
        return;
      }

      // Check if file was uploaded
      const file = (req as any).file;
      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        res.status(400).json({
          success: false,
          message: 'File size exceeds 5MB limit'
        });
        return;
      }
      
      // Parse Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: AccountData[] = XLSX.utils.sheet_to_json(worksheet);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Excel file is empty or invalid'
        });
        return;
      }

      // Validate that we don't have too many records
      if (jsonData.length > 1000) {
        res.status(400).json({
          success: false,
          message: 'Maximum 1000 accounts can be created in a single upload'
        });
        return;
      }

      // Validate that all accounts have required fields
      const validationErrors = [];
      for (let i = 0; i < jsonData.length; i++) {
        const account = jsonData[i];
        const rowNumber = i + 2; // +1 for header row, +1 for 0-based index
        
        if (!account.firstName || !account.lastName || !account.email || !account.mobile || !account.role) {
          validationErrors.push(`Row ${rowNumber}: Missing required fields (firstName, lastName, email, mobile, role)`);
          continue;
        }

        // Validate email format
        if (!EMAIL_REGEX.test(account.email)) {
          validationErrors.push(`Row ${rowNumber}: Invalid email format for ${account.email}`);
          continue;
        }

        // Validate mobile format
        if (!MOBILE_REGEX.test(account.mobile)) {
          validationErrors.push(`Row ${rowNumber}: Invalid mobile number format for ${account.mobile}`);
          continue;
        }

        // Validate role
        if (account.role !== 'student' && account.role !== 'mentor') {
          validationErrors.push(`Row ${rowNumber}: Invalid role '${account.role}'. Must be 'student' or 'mentor'`);
          continue;
        }

        // Validate name lengths
        if (account.firstName.length < 2 || account.firstName.length > 50) {
          validationErrors.push(`Row ${rowNumber}: First name must be between 2 and 50 characters`);
          continue;
        }

        if (account.lastName.length < 2 || account.lastName.length > 50) {
          validationErrors.push(`Row ${rowNumber}: Last name must be between 2 and 50 characters`);
          continue;
        }

        // Validate optional field lengths
        if (account.university && account.university.length > 100) {
          validationErrors.push(`Row ${rowNumber}: University name cannot exceed 100 characters`);
          continue;
        }
        
        // For students
        if (account.role === 'student') {
          if (account.major && account.major.length > 100) {
            validationErrors.push(`Row ${rowNumber}: Major cannot exceed 100 characters`);
            continue;
          }
          
          if (account.year && account.year.length > 20) {
            validationErrors.push(`Row ${rowNumber}: Year cannot exceed 20 characters`);
            continue;
          }
          
          if (account.studentId && account.studentId.length > 50) {
            validationErrors.push(`Row ${rowNumber}: Student ID cannot exceed 50 characters`);
            continue;
          }
          
          if (account.graduationYear && account.graduationYear.length > 4) {
            validationErrors.push(`Row ${rowNumber}: Graduation year cannot exceed 4 characters`);
            continue;
          }
        }
        
        // For mentors
        if (account.role === 'mentor') {
          if (account.department && account.department.length > 100) {
            validationErrors.push(`Row ${rowNumber}: Department cannot exceed 100 characters`);
            continue;
          }
          
          if (account.bio && account.bio.length > 500) {
            validationErrors.push(`Row ${rowNumber}: Bio cannot exceed 500 characters`);
            continue;
          }
          
          // Validate skills if provided as a string (comma-separated)
          if (account.skills && typeof account.skills === 'string') {
            const skillsArray = (account.skills as string).split(',').map(skill => skill.trim()).filter(skill => skill);
            if (skillsArray.length > 20) {
              validationErrors.push(`Row ${rowNumber}: Cannot have more than 20 skills`);
              continue;
            }
            
            // Validate each skill
            for (const skill of skillsArray) {
              if (skill.length > 50) {
                validationErrors.push(`Row ${rowNumber}: Skill '${skill}' cannot exceed 50 characters`);
                continue;
              }
            }
          }
          
          // Validate skills if provided as an array
          if (account.skills && Array.isArray(account.skills)) {
            if (account.skills.length > 20) {
              validationErrors.push(`Row ${rowNumber}: Cannot have more than 20 skills`);
              continue;
            }
            
            // Validate each skill
            for (const skill of account.skills) {
              if (typeof skill !== 'string' || skill.length === 0 || skill.length > 50) {
                validationErrors.push(`Row ${rowNumber}: Invalid skill format`);
                continue;
              }
            }
          }
        }
      }

      // If there are validation errors, return them
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed for some records',
          errors: validationErrors
        });
        return;
      }

      // Create accounts
      const createdAccounts = [];
      const errors = [];
      
      for (let i = 0; i < jsonData.length; i++) {
        const accountData = jsonData[i];
        const rowNumber = i + 2;
        
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email: accountData.email });
          if (existingUser) {
            errors.push(`Row ${rowNumber}: User already exists with email: ${accountData.email}`);
            continue;
          }

          // For institution admins, ensure accounts are created under their institution
          let userUniversity = accountData.university;
          if (req.user?.role === 'institution') {
            userUniversity = req.user.university;
          }

          // Create new user with a temporary password
          const temporaryPassword = Math.random().toString(36).slice(-8);
          
          const userData: any = {
            email: accountData.email,
            password: temporaryPassword,
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            mobile: accountData.mobile,
            role: accountData.role,
            isEmailVerified: false,
            isMobileVerified: false,
            isActive: true
          };

          // Add university
          if (userUniversity) {
            userData.university = userUniversity;
          }

          // Add student-specific fields
          if (accountData.role === 'student') {
            if (accountData.major) userData.major = accountData.major;
            if (accountData.year) userData.year = accountData.year;
            if (accountData.studentId) userData.studentId = accountData.studentId;
            if (accountData.graduationYear) userData.graduationYear = accountData.graduationYear;
          }
          
          // Add mentor-specific fields
          if (accountData.role === 'mentor') {
            if (accountData.department) userData.department = accountData.department;
            if (accountData.bio) userData.bio = accountData.bio;
            
            // Handle skills
            if (accountData.skills) {
              let skillsArray: string[] = [];
              if (typeof accountData.skills === 'string') {
                skillsArray = (accountData.skills as string).split(',').map(skill => skill.trim()).filter(skill => skill);
              } else if (Array.isArray(accountData.skills)) {
                skillsArray = accountData.skills.filter((skill: any) => 
                  typeof skill === 'string' && skill.length > 0 && skill.length <= 50
                );
              }
              userData.skills = skillsArray;
            }
          }

          const user = await User.create(userData);
          createdAccounts.push({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          });
        } catch (accountError: any) {
          errors.push(`Row ${rowNumber}: Failed to create account for ${accountData.email}: ${accountError.message}`);
        }
      }

      res.status(201).json({
        success: true,
        message: `Bulk account creation completed. ${createdAccounts.length} accounts created, ${errors.length} errors.`,
        data: {
          created: createdAccounts.length,
          errors: errors.length,
          accounts: createdAccounts,
          errorDetails: errors
        }
      });
    } catch (error: any) {
      console.error('Bulk create accounts error:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Duplicate email or mobile number found'
        });
        return;
      }
      
      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to process bulk account creation'
      });
    }
  }

  /**
   * Get institution accounts (students and mentors)
   * Filter by institution if user is an institution admin
   */
  static async getInstitutionAccounts(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can view accounts'
        });
        return;
      }

      const { page = 1, limit = 20, role, search, sort = 'createdAt', order = 'desc' } = req.query;

      // Validate pagination parameters
      const pageNum = Number(page);
      const limitNum = Number(limit);
      
      if (isNaN(pageNum) || pageNum < 1) {
        res.status(400).json({
          success: false,
          message: 'Invalid page number'
        });
        return;
      }
      
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid limit. Must be between 1 and 100'
        });
        return;
      }

      // Build query
      const query: any = {
        role: { $in: ['student', 'mentor'] }
      };

      // Institution admins can only see accounts from their own institution
      if (req.user?.role === 'institution') {
        query.university = req.user.university;
      }

      // Add role filter if specified
      if (role && (role === 'student' || role === 'mentor')) {
        query.role = role;
      }

      // Add search filter if specified
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ];
      }

      // Validate sort field
      const validSortFields = ['firstName', 'lastName', 'email', 'createdAt', 'role'];
      const sortField = validSortFields.includes(sort as string) ? sort : 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;

      // Calculate pagination
      const skip = (pageNum - 1) * limitNum;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort({ [sortField]: sortOrder })
          .skip(skip)
          .limit(limitNum),
        User.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        message: 'Accounts retrieved successfully',
        data: {
          accounts: users,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: totalPages
          }
        }
      });
    } catch (error) {
      console.error('Get institution accounts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve accounts'
      });
    }
  }

  /**
   * Download Excel template for bulk account creation
   */
  static async downloadTemplate(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Authentication and authorization are handled by middleware
      // If we reach this point, the user is authenticated and authorized
      console.log('Download template called by user:', req.user?.email, 'with role:', req.user?.role);
      console.log('Download template called by user:', req.user?.email, 'with role:', req.user?.role);
      
      // Authentication and authorization are handled by middleware
      // If we reach this point, the user is authenticated and authorized

      // Create template data with both student and mentor examples
      const templateData: AccountData[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobile: '+1234567890',
          role: 'student',
          university: 'Example University',
          major: 'Computer Science',
          year: '3',
          studentId: 'STU123456',
          graduationYear: '2025'
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          mobile: '+1234567891',
          role: 'mentor',
          university: 'Example University',
          department: 'Computer Science',
          bio: 'Specialized in artificial intelligence and machine learning with 10+ years of industry experience.',
          skills: ['AI', 'Machine Learning', 'Data Science', 'Python', 'TensorFlow']
        }
      ];

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounts');

      // Write to buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Set headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="institution_accounts_template.xlsx"');
      res.status(200).send(buffer);
    } catch (error) {
      console.error('Download template error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate template'
      });
    }
  }

  /**
   * Update user account
   */
  static async updateAccount(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can update accounts'
        });
        return;
      }

      const { id } = req.params;
      const {
        firstName,
        lastName,
        email,
        mobile,
        role,
        university,
        major,
        year,
        studentId,
        graduationYear,
        department, // For mentors
        bio, // For mentors
        skills, // For mentors
        isActive
      } = req.body;

      // Find the user to update
      const userToUpdate = await User.findById(id);
      if (!userToUpdate) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Institution admins can only update accounts from their own institution
      if (req.user?.role === 'institution' && userToUpdate.university !== req.user.university) {
        res.status(403).json({
          success: false,
          message: 'Institution admins can only update accounts from their own institution'
        });
        return;
      }

      // Build update object
      const updateData: any = {};
      
      if (firstName !== undefined) {
        if (firstName.length < 2 || firstName.length > 50) {
          res.status(400).json({
            success: false,
            message: 'First name must be between 2 and 50 characters'
          });
          return;
        }
        updateData.firstName = firstName;
      }

      if (lastName !== undefined) {
        if (lastName.length < 2 || lastName.length > 50) {
          res.status(400).json({
            success: false,
            message: 'Last name must be between 2 and 50 characters'
          });
          return;
        }
        updateData.lastName = lastName;
      }

      if (email !== undefined) {
        if (!EMAIL_REGEX.test(email)) {
          res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
          return;
        }
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
          res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
          return;
        }
        updateData.email = email;
      }

      if (mobile !== undefined) {
        if (!MOBILE_REGEX.test(mobile)) {
          res.status(400).json({
            success: false,
            message: 'Invalid mobile number format'
          });
          return;
        }
        // Check if mobile is already taken by another user
        const existingUser = await User.findOne({ mobile, _id: { $ne: id } });
        if (existingUser) {
          res.status(400).json({
            success: false,
            message: 'Mobile number already exists'
          });
          return;
        }
        updateData.mobile = mobile;
      }

      // Institution admins cannot change the role or university of accounts
      if (req.user?.role === 'institution') {
        if (role !== undefined && role !== userToUpdate.role) {
          res.status(403).json({
            success: false,
            message: 'Institution admins cannot change user roles'
          });
          return;
        }
        
        if (university !== undefined && university !== userToUpdate.university) {
          res.status(403).json({
            success: false,
            message: 'Institution admins cannot change user universities'
          });
          return;
        }
      } else {
        // Admins can change role and university
        if (role !== undefined) {
          if (role !== 'student' && role !== 'mentor') {
            res.status(400).json({
              success: false,
              message: 'Role must be either student or mentor'
            });
            return;
          }
          updateData.role = role;
        }

        if (university !== undefined) {
          if (university.length > 100) {
            res.status(400).json({
              success: false,
              message: 'University name cannot exceed 100 characters'
            });
            return;
          }
          updateData.university = university;
        }
      }

      // Handle role-specific fields
      if (userToUpdate.role === 'student' || (role === 'student')) {
        if (major !== undefined) {
          if (major.length > 100) {
            res.status(400).json({
              success: false,
              message: 'Major cannot exceed 100 characters'
            });
            return;
          }
          updateData.major = major;
        }

        if (year !== undefined) {
          if (year.length > 20) {
            res.status(400).json({
              success: false,
              message: 'Year cannot exceed 20 characters'
            });
            return;
          }
          updateData.year = year;
        }

        if (studentId !== undefined) {
          if (studentId.length > 50) {
            res.status(400).json({
              success: false,
              message: 'Student ID cannot exceed 50 characters'
            });
            return;
          }
          updateData.studentId = studentId;
        }

        if (graduationYear !== undefined) {
          if (graduationYear.length > 4) {
            res.status(400).json({
              success: false,
              message: 'Graduation year cannot exceed 4 characters'
            });
            return;
          }
          updateData.graduationYear = graduationYear;
        }
      }

      if (userToUpdate.role === 'mentor' || (role === 'mentor')) {
        if (department !== undefined) {
          if (department.length > 100) {
            res.status(400).json({
              success: false,
              message: 'Department cannot exceed 100 characters'
            });
            return;
          }
          updateData.department = department;
        }

        if (bio !== undefined) {
          if (bio.length > 500) {
            res.status(400).json({
              success: false,
              message: 'Bio cannot exceed 500 characters'
            });
            return;
          }
          updateData.bio = bio;
        }

        if (skills !== undefined) {
          if (!Array.isArray(skills)) {
            res.status(400).json({
              success: false,
              message: 'Skills must be an array'
            });
            return;
          }
          
          // Limit to 20 skills max
          if (skills.length > 20) {
            res.status(400).json({
              success: false,
              message: 'Cannot have more than 20 skills'
            });
            return;
          }
          
          // Validate each skill
          const validatedSkills = skills.filter((skill: any) => 
            typeof skill === 'string' && skill.length > 0 && skill.length <= 50
          );
          
          updateData.skills = validatedSkills;
        }
      }

      if (isActive !== undefined) {
        updateData.isActive = Boolean(isActive);
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account updated successfully',
        data: { user }
      });
    } catch (error: any) {
      console.error('Update account error:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Email or mobile number already exists'
        });
        return;
      }
      
      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update account'
      });
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can delete accounts'
        });
        return;
      }

      const { id } = req.params;

      // Find the user to delete
      const userToDelete = await User.findById(id);
      if (!userToDelete) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Institution admins can only delete accounts from their own institution
      if (req.user?.role === 'institution' && userToDelete.university !== req.user.university) {
        res.status(403).json({
          success: false,
          message: 'Institution admins can only delete accounts from their own institution'
        });
        return;
      }

      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  }

  /**
   * Activate user account
   */
  static async activateAccount(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can activate accounts'
        });
        return;
      }

      const { id } = req.params;

      // Find the user to activate
      const userToActivate = await User.findById(id);
      if (!userToActivate) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Institution admins can only activate accounts from their own institution
      if (req.user?.role === 'institution' && userToActivate.university !== req.user.university) {
        res.status(403).json({
          success: false,
          message: 'Institution admins can only activate accounts from their own institution'
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account activated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Activate account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to activate account'
      });
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can deactivate accounts'
        });
        return;
      }

      const { id } = req.params;

      // Find the user to deactivate
      const userToDeactivate = await User.findById(id);
      if (!userToDeactivate) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Institution admins can only deactivate accounts from their own institution
      if (req.user?.role === 'institution' && userToDeactivate.university !== req.user.university) {
        res.status(403).json({
          success: false,
          message: 'Institution admins can only deactivate accounts from their own institution'
        });
        return;
      }

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account deactivated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Deactivate account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate account'
      });
    }
  }

  /**
   * Get account statistics
   * Filter by institution if user is an institution admin
   */
  static async getAccountStats(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // Check if user is an admin or institution admin
      if (req.user?.role !== 'admin' && req.user?.role !== 'institution') {
        res.status(403).json({
          success: false,
          message: 'Only administrators and institution admins can view account statistics'
        });
        return;
      }

      // Build query based on user role
      const baseQuery: any = {};
      
      // Institution admins can only see stats for their own institution
      if (req.user?.role === 'institution') {
        baseQuery.university = req.user.university;
      }

      // Get counts for different user types
      const [studentUsers, mentorUsers, activeUsers, recentUsers] = await Promise.all([
        User.countDocuments({ ...baseQuery, role: 'student' }),
        User.countDocuments({ ...baseQuery, role: 'mentor' }),
        User.countDocuments({ ...baseQuery, isActive: true }),
        User.countDocuments({ 
          ...baseQuery, 
          role: { $in: ['student', 'mentor'] },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        })
      ]);

      res.json({
        success: true,
        message: 'Account statistics retrieved successfully',
        data: {
          studentUsers,
          mentorUsers,
          activeUsers,
          recentUsers
        }
      });
    } catch (error) {
      console.error('Get account stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve account statistics'
      });
    }
  }
}