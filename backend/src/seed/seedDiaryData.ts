import mongoose from 'mongoose';
import { config } from '../config/config';
import { ProjectDiary } from '../models/ProjectDiary';
import { Project } from '../models/Project';
import { User } from '../models/User';

// Sample diary entries data
const sampleDiaryEntries = [
  {
    entryType: 'daily',
    title: 'Project Setup and Initial Planning',
    content: `Today I started working on my final year project. I spent the morning setting up the development environment and creating the initial project structure. 

Key activities completed:
- Installed necessary dependencies and frameworks
- Set up version control with Git
- Created the basic folder structure
- Researched similar projects for inspiration

Challenges faced:
- Had some issues with the database connection initially
- Need to learn more about the specific framework I'm using

Next steps:
- Complete the project proposal
- Set up the database schema
- Start working on the core functionality

Time spent: 4 hours
Mood: Excited but a bit overwhelmed`,
    attachments: ['project_setup_notes.pdf', 'initial_design_sketch.jpg'],
    status: 'submitted'
  },
  {
    entryType: 'weekly',
    title: 'First Week Progress - Database Design',
    content: `This week I focused on designing the database schema for my project. It's been a challenging but rewarding experience.

What I accomplished:
- Analyzed the requirements thoroughly
- Designed the database schema with proper relationships
- Created ER diagrams using Lucidchart
- Set up the database with initial tables
- Wrote basic CRUD operations

Technical details:
- Using PostgreSQL as the database
- Implemented proper indexing for performance
- Added foreign key constraints
- Created stored procedures for complex queries

Challenges:
- Understanding complex relationships between entities
- Optimizing query performance
- Learning about database normalization

Learning outcomes:
- Better understanding of database design principles
- Improved SQL skills
- Knowledge of database optimization techniques

Goals for next week:
- Implement user authentication
- Create the main application interface
- Add data validation and error handling`,
    attachments: ['database_schema.png', 'er_diagram.pdf', 'sql_queries.sql'],
    status: 'submitted'
  },
  {
    entryType: 'milestone',
    title: 'Milestone 1: Core Functionality Implementation',
    content: `Successfully completed the first major milestone of my project! This was a significant achievement.

Milestone details:
- Implemented user authentication system
- Created user registration and login functionality
- Built the main dashboard interface
- Added basic CRUD operations for all entities
- Implemented data validation and error handling

Technical achievements:
- Used JWT for authentication
- Implemented password hashing with bcrypt
- Created responsive UI using React
- Added form validation on both frontend and backend
- Implemented proper error handling and logging

Testing completed:
- Unit tests for all major functions
- Integration tests for API endpoints
- User acceptance testing with friends
- Performance testing with sample data

Feedback received:
- Mentor was impressed with the code quality
- Suggested improvements for scalability
- Recommended adding more comprehensive error handling

Challenges overcome:
- Initially struggled with authentication flow
- Had to refactor code for better maintainability
- Learned about security best practices

Time invested: 25 hours over 2 weeks
Overall satisfaction: Very satisfied with the progress`,
    attachments: ['milestone_1_report.pdf', 'code_review_notes.pdf', 'test_results.xlsx'],
    status: 'approved'
  },
  {
    entryType: 'daily',
    title: 'Debugging Session - Database Connection Issues',
    content: `Had a frustrating day dealing with database connection issues. Spent most of the day debugging rather than making progress on features.

Issues encountered:
- Database connection was dropping randomly
- Timeout errors during peak usage
- Memory leaks in the application
- Slow query performance

Debugging process:
- Checked database logs for errors
- Analyzed application memory usage
- Tested different connection pool settings
- Profiled slow queries

Solutions implemented:
- Increased connection pool size
- Added connection retry logic
- Optimized slow queries with proper indexing
- Implemented connection health checks

Lessons learned:
- Always monitor database performance
- Implement proper logging from the start
- Use connection pooling effectively
- Regular database maintenance is crucial

Time spent debugging: 6 hours
Frustration level: High initially, but satisfying to solve

Tomorrow's plan:
- Continue with feature development
- Implement better error handling
- Add more comprehensive logging`,
    attachments: ['debug_logs.txt', 'performance_analysis.pdf'],
    status: 'submitted'
  },
  {
    entryType: 'weekly',
    title: 'Week 3: Advanced Features Implementation',
    content: `This week I focused on implementing advanced features that will make my project stand out.

Features implemented:
- Real-time notifications system using WebSockets
- Advanced search functionality with filters
- Data export capabilities (PDF, Excel, CSV)
- User role management system
- Audit logging for all user actions

Technical highlights:
- Implemented WebSocket connections for real-time updates
- Created a sophisticated search algorithm
- Built a flexible export system
- Implemented role-based access control
- Added comprehensive audit trails

Code quality improvements:
- Refactored code for better maintainability
- Added comprehensive documentation
- Implemented design patterns (Factory, Observer)
- Added extensive error handling
- Created reusable components

Performance optimizations:
- Implemented caching for frequently accessed data
- Optimized database queries
- Added lazy loading for large datasets
- Implemented pagination for better UX

Challenges faced:
- WebSocket implementation was complex
- Search algorithm needed multiple iterations
- Export functionality required learning new libraries
- Role management needed careful planning

Learning outcomes:
- Better understanding of real-time applications
- Improved algorithm design skills
- Enhanced knowledge of security principles
- Better code organization techniques

Next week's goals:
- Implement the reporting system
- Add data visualization features
- Prepare for user testing
- Write comprehensive documentation`,
    attachments: ['feature_specifications.pdf', 'code_architecture.png', 'performance_metrics.xlsx'],
    status: 'submitted'
  },
  {
    entryType: 'review',
    title: 'Mid-Project Review with Mentor',
    content: `Had an excellent review session with my mentor today. Got valuable feedback and guidance for the remaining work.

Review highlights:
- Mentor was impressed with the progress made
- Code quality was praised
- Suggestions for improvement were provided
- Timeline adjustments were discussed

Positive feedback received:
- "Excellent understanding of the requirements"
- "Code is well-structured and maintainable"
- "Good use of modern development practices"
- "Impressive attention to detail"

Areas for improvement:
- Add more comprehensive testing
- Improve error messages for better user experience
- Consider scalability for future enhancements
- Add more documentation for complex functions

Technical discussions:
- Discussed database optimization strategies
- Reviewed security implementation
- Planned the remaining features
- Discussed deployment considerations

Action items:
- Implement suggested improvements
- Add more test cases
- Improve user interface based on feedback
- Prepare for final presentation

Mentor's overall assessment: "Excellent work so far. Keep up the good pace and focus on the remaining features."

Confidence level: High
Motivation: Very motivated to complete the project successfully`,
    attachments: ['mentor_feedback.pdf', 'review_notes.pdf', 'action_plan.pdf'],
    status: 'approved'
  },
  {
    entryType: 'daily',
    title: 'Final Testing and Bug Fixes',
    content: `Spent the day doing final testing and fixing the last few bugs before submission.

Testing activities:
- Comprehensive functionality testing
- Cross-browser compatibility testing
- Performance testing with large datasets
- Security testing for vulnerabilities
- User acceptance testing

Bugs found and fixed:
- Fixed a minor UI issue in the dashboard
- Resolved a data validation bug
- Fixed a performance issue with large datasets
- Corrected a timezone handling bug

Quality assurance:
- All test cases are passing
- Code coverage is above 90%
- No critical security vulnerabilities found
- Performance meets the requirements

Final preparations:
- Updated documentation
- Prepared user manual
- Created installation guide
- Prepared presentation materials

Reflection on the project:
- Learned a lot about full-stack development
- Improved problem-solving skills
- Better understanding of software engineering principles
- Gained confidence in my abilities

Ready for submission: Yes
Overall satisfaction: Very satisfied with the final result`,
    attachments: ['test_results.pdf', 'bug_fixes_log.txt', 'final_documentation.pdf'],
    status: 'submitted'
  },
  {
    entryType: 'milestone',
    title: 'Final Milestone: Project Completion',
    content: `🎉 Successfully completed my final year project! This has been an incredible learning journey.

Final achievements:
- All planned features implemented successfully
- Comprehensive testing completed
- Documentation is complete and thorough
- Project is ready for deployment
- Presentation materials prepared

Technical accomplishments:
- Built a full-stack web application
- Implemented modern development practices
- Created a scalable and maintainable codebase
- Integrated multiple technologies effectively
- Delivered a production-ready application

Key learnings:
- Full-stack development skills
- Database design and optimization
- API development and integration
- Frontend development with modern frameworks
- Testing and quality assurance
- Project management and planning

Challenges overcome:
- Learning new technologies quickly
- Managing project scope and timeline
- Debugging complex issues
- Balancing features with quality
- Meeting academic requirements

Skills developed:
- Problem-solving and debugging
- Code organization and architecture
- Team collaboration (with mentor)
- Time management and planning
- Technical communication

Future plans:
- Deploy the application for public use
- Continue learning and improving
- Apply skills to new projects
- Share knowledge with other students

Final thoughts:
This project has been the most challenging and rewarding experience of my academic career. I'm proud of what I've accomplished and excited about the skills I've developed.

Project status: COMPLETED ✅
Overall grade expectation: A+
Confidence level: Very high`,
    attachments: ['final_report.pdf', 'project_demo_video.mp4', 'deployment_guide.pdf', 'presentation_slides.pptx'],
    status: 'approved'
  }
];

async function seedDiaryData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample student and project
    const student = await User.findOne({ role: 'student' });
    const project = await Project.findOne({ studentId: student?._id });

    if (!student || !project) {
      console.log('No student or project found. Please create a student and project first.');
      return;
    }

    console.log(`Creating diary entries for student: ${student.firstName} ${student.lastName}`);
    console.log(`Project: ${project.title}`);

    // Clear existing diary entries for this project
    await ProjectDiary.deleteMany({ projectId: project._id });
    console.log('Cleared existing diary entries');

    // Create sample diary entries
    const diaryEntries = [];
    for (let i = 0; i < sampleDiaryEntries.length; i++) {
      const entry = sampleDiaryEntries[i];
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - (sampleDiaryEntries.length - i) * 2); // Spread entries over time

      const diaryEntry = new ProjectDiary({
        projectId: project._id,
        studentId: student._id,
        entryType: entry.entryType,
        title: entry.title,
        content: entry.content,
        attachments: entry.attachments,
        status: entry.status,
        entryDate: entryDate,
        mentorFeedback: entry.status === 'approved' ? {
          comment: 'Excellent work! Keep up the great progress.',
          rating: 5,
          submittedAt: new Date(entryDate.getTime() + 24 * 60 * 60 * 1000) // Next day
        } : undefined
      });

      diaryEntries.push(diaryEntry);
    }

    // Save all diary entries
    await ProjectDiary.insertMany(diaryEntries);
    console.log(`✅ Created ${diaryEntries.length} sample diary entries`);

    // Display summary
    console.log('\n📊 Diary Entries Summary:');
    console.log(`- Daily entries: ${diaryEntries.filter(e => e.entryType === 'daily').length}`);
    console.log(`- Weekly entries: ${diaryEntries.filter(e => e.entryType === 'weekly').length}`);
    console.log(`- Milestone entries: ${diaryEntries.filter(e => e.entryType === 'milestone').length}`);
    console.log(`- Review entries: ${diaryEntries.filter(e => e.entryType === 'review').length}`);
    console.log(`- Submitted entries: ${diaryEntries.filter(e => e.status === 'submitted').length}`);
    console.log(`- Approved entries: ${diaryEntries.filter(e => e.status === 'approved').length}`);

    console.log('\n🎉 Sample diary data has been successfully inserted!');
    console.log('You can now view these entries in the diary section of your application.');

  } catch (error) {
    console.error('Error seeding diary data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDiaryData();


