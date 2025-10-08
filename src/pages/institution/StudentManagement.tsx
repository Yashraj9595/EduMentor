import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { useInstitutionAccounts } from './InstitutionDashboard/InstitutionDashboard.hooks';
import { InstitutionUser } from './InstitutionDashboard/InstitutionDashboard.types';
import { BulkUploadSection } from './InstitutionDashboard/components/BulkUploadSection';
import { Pagination } from './InstitutionDashboard/components/Pagination';

export const StudentManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingStudent, setEditingStudent] = useState<InstitutionUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<'all' | string>('all');
  const [filterMajor, setFilterMajor] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const {
    users,
    loading,
    bulkLoading,
    stats,
    pagination,
    createAccount,
    createBulkAccounts,
    downloadTemplate,
    updateAccount,
    fetchAccounts,
    fetchStats
  } = useInstitutionAccounts();

  // Filter users to only show students
  const students = users.filter(user => user.role === 'student');

  useEffect(() => {
    fetchAccounts({ role: 'student' });
    fetchStats();
  }, [fetchAccounts, fetchStats]);

  useEffect(() => {
    // Check if we should show form based on URL params
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const studentData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      role: 'student' as const,
      university: formData.get('university') as string,
      major: formData.get('major') as string,
      year: formData.get('year') as string,
      studentId: formData.get('studentId') as string,
      graduationYear: formData.get('graduationYear') as string,
      department: formData.get('department') as string,
      bio: formData.get('bio') as string,
      skills: []
    };

    const result = await createAccount(studentData);
    if (result.success) {
      setShowForm(false);
      fetchAccounts({ role: 'student' });
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent && editingStudent.id) {
      const formData = new FormData(e.target as HTMLFormElement);
      const updateData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        university: formData.get('university') as string,
        major: formData.get('major') as string,
        year: formData.get('year') as string,
        studentId: formData.get('studentId') as string,
        graduationYear: formData.get('graduationYear') as string,
        department: formData.get('department') as string,
        bio: formData.get('bio') as string,
        skills: []
      };

      const result = await updateAccount(editingStudent.id, updateData);
      if (result.success) {
        setEditingStudent(null);
        setShowForm(false);
        fetchAccounts({ role: 'student' });
      }
    }
  };

  // Institution users can only create accounts, not edit or delete
  const handleEditStudent = (_student: InstitutionUser) => {
    // Disabled for institution users
    alert('Institution users can only create new accounts. Contact admin for account modifications.');
  };

  const handleDeleteStudent = async (_id: string) => {
    // Disabled for institution users
    alert('Institution users cannot delete accounts. Contact admin for account removal.');
  };

  const handleToggleStatus = async (_student: InstitutionUser) => {
    // Disabled for institution users
    alert('Institution users cannot modify account status. Contact admin for status changes.');
  };

  const handleBulkUpload = async (file: File) => {
    const result = await createBulkAccounts(file);
    if (result.success) {
      setShowBulkUpload(false);
      fetchAccounts({ role: 'student' });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchAccounts({ 
      role: 'student', 
      search: term
    });
  };

  const handleFilter = (field: 'year' | 'major', value: string) => {
    if (field === 'year') {
      setFilterYear(value);
    } else {
      setFilterMajor(value);
    }
    
    fetchAccounts({ 
      role: 'student',
      search: searchTerm
    });
  };

  const handlePageChange = (page: number) => {
    fetchAccounts({ 
      role: 'student',
      page,
      search: searchTerm
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getYearOptions = () => {
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];
    return [
      { value: 'all', label: 'All Years' },
      ...years.map(year => ({ value: year, label: year }))
    ];
  };

  const getMajorOptions = () => {
    const majors = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Mathematics', 'Physics'];
    return [
      { value: 'all', label: 'All Majors' },
      ...majors.map(major => ({ value: major, label: major }))
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student accounts and profiles</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Student
          </Button>
          <Button
            onClick={() => setShowBulkUpload(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Bulk Upload
          </Button>
          <Button
            onClick={() => downloadTemplate()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Template
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">{stats.activeAccounts}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recent Additions</p>
                  <p className="text-2xl font-bold">{stats.recentAccounts}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
                <Award className="h-8 w-8 text-amber-500" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filterYear}
                onChange={(e) => handleFilter('year', e.target.value)}
                options={getYearOptions()}
              />
              <Select
                value={filterMajor}
                onChange={(e) => handleFilter('major', e.target.value)}
                options={getMajorOptions()}
              />
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                {viewMode === 'list' ? 'Grid View' : 'List View'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Upload Section */}
      {showBulkUpload && (
        <BulkUploadSection
          onFileSelect={handleBulkUpload}
          onDownloadTemplate={downloadTemplate}
          bulkLoading={bulkLoading}
        />
      )}

      {/* Student Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  defaultValue={editingStudent?.firstName || ''}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  defaultValue={editingStudent?.lastName || ''}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={editingStudent?.email || ''}
                  required
                />
                <Input
                  label="Mobile"
                  name="mobile"
                  defaultValue={editingStudent?.mobile || ''}
                  required
                />
                <Input
                  label="University"
                  name="university"
                  defaultValue={editingStudent?.university || ''}
                />
                <Input
                  label="Major"
                  name="major"
                  defaultValue={editingStudent?.major || ''}
                />
                <Input
                  label="Year"
                  name="year"
                  defaultValue={editingStudent?.year || ''}
                />
                <Input
                  label="Student ID"
                  name="studentId"
                  defaultValue={editingStudent?.studentId || ''}
                />
                <Input
                  label="Graduation Year"
                  name="graduationYear"
                  defaultValue={editingStudent?.graduationYear || ''}
                />
                <Input
                  label="Department"
                  name="department"
                  defaultValue={editingStudent?.department || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={editingStudent?.bio || ''}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Student bio..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStudent ? 'Update Student' : 'Create Student'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Students List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Students ({students.length})</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No students found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(student.isActive || false)}>
                          {getStatusText(student.isActive || false)}
                        </Badge>
                      </div>
                      {student.major && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Major:</span>
                          <span>{student.major}</span>
                        </div>
                      )}
                      {student.year && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year:</span>
                          <span>{student.year}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStudent(student)}
                        className="flex-1 opacity-50 cursor-not-allowed"
                        disabled
                        title="Institution users can only create accounts"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => student.id && handleToggleStatus(student)}
                        className="flex-1 opacity-50 cursor-not-allowed"
                        disabled
                        title="Institution users cannot modify account status"
                      >
                        {student.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => student.id && handleDeleteStudent(student.id)}
                        className="flex-1 opacity-50 cursor-not-allowed"
                        disabled
                        title="Institution users cannot delete accounts"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Major</th>
                    <th className="text-left py-3 px-4">Year</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-muted-foreground">{student.mobile}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{student.email}</td>
                      <td className="py-3 px-4">{student.major || '-'}</td>
                      <td className="py-3 px-4">{student.year || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(student.isActive || false)}>
                          {getStatusText(student.isActive || false)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStudent(student)}
                            className="opacity-50 cursor-not-allowed"
                            disabled
                            title="Institution users can only create accounts"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(student)}
                            className="opacity-50 cursor-not-allowed"
                            disabled
                            title="Institution users cannot modify account status"
                          >
                            {student.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => student.id && handleDeleteStudent(student.id)}
                            className="opacity-50 cursor-not-allowed"
                            disabled
                            title="Institution users cannot delete accounts"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
