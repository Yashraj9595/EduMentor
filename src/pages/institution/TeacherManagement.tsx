import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  Calendar,
  Award,
  Star
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

export const TeacherManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<InstitutionUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<'all' | string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [skillsInput, setSkillsInput] = useState('');

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

  // Filter users to only show teachers/mentors
  const teachers = users.filter(user => user.role === 'mentor');

  useEffect(() => {
    fetchAccounts({ role: 'mentor' });
    fetchStats();
  }, [fetchAccounts, fetchStats]);

  useEffect(() => {
    // Check if we should show form based on URL params
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const teacherData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      mobile: formData.get('mobile') as string,
      role: 'mentor' as const,
      university: formData.get('university') as string,
      department: formData.get('department') as string,
      bio: formData.get('bio') as string,
      skills: skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    const result = await createAccount(teacherData);
    if (result.success) {
      setShowForm(false);
      setSkillsInput('');
      fetchAccounts({ role: 'mentor' });
    }
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher && editingTeacher.id) {
      const formData = new FormData(e.target as HTMLFormElement);
      const updateData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        university: formData.get('university') as string,
        department: formData.get('department') as string,
        bio: formData.get('bio') as string,
        skills: skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      const result = await updateAccount(editingTeacher.id, updateData);
      if (result.success) {
        setEditingTeacher(null);
        setShowForm(false);
        setSkillsInput('');
        fetchAccounts({ role: 'mentor' });
      }
    }
  };

  // Institution users can only create accounts, not edit or delete
  const handleEditTeacher = (_teacher: InstitutionUser) => {
    // Disabled for institution users
    alert('Institution users can only create new accounts. Contact admin for account modifications.');
  };

  const handleDeleteTeacher = async (_id: string) => {
    // Disabled for institution users
    alert('Institution users cannot delete accounts. Contact admin for account removal.');
  };

  const handleToggleStatus = async (_teacher: InstitutionUser) => {
    // Disabled for institution users
    alert('Institution users cannot modify account status. Contact admin for status changes.');
  };

  const handleBulkUpload = async (file: File) => {
    const result = await createBulkAccounts(file);
    if (result.success) {
      setShowBulkUpload(false);
      fetchAccounts({ role: 'mentor' });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchAccounts({ 
      role: 'mentor', 
      search: term
    });
  };

  const handleFilter = (field: 'department' | 'status', value: string) => {
    if (field === 'department') {
      setFilterDepartment(value);
    } else {
      setFilterStatus(value as 'all' | 'active' | 'inactive');
    }
    
    fetchAccounts({ 
      role: 'mentor',
      search: searchTerm
    });
  };

  const handlePageChange = (page: number) => {
    fetchAccounts({ 
      role: 'mentor',
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

  const getDepartmentOptions = () => {
    const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Mathematics', 'Physics', 'Chemistry'];
    return [
      { value: 'all', label: 'All Departments' },
      ...departments.map(dept => ({ value: dept, label: dept }))
    ];
  };

  const getStatusOptions = () => [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground">Manage teacher accounts and profiles</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Teacher
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
                  <p className="text-sm text-muted-foreground">Total Teachers</p>
                  <p className="text-2xl font-bold">{stats.totalMentors}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Teachers</p>
                  <p className="text-2xl font-bold">{stats.activeAccounts}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
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
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <Star className="h-8 w-8 text-amber-500" />
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
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filterDepartment}
                onChange={(e) => handleFilter('department', e.target.value)}
                options={getDepartmentOptions()}
              />
              <Select
                value={filterStatus}
                onChange={(e) => handleFilter('status', e.target.value)}
                options={getStatusOptions()}
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

      {/* Teacher Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={editingTeacher ? handleUpdateTeacher : handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  defaultValue={editingTeacher?.firstName || ''}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  defaultValue={editingTeacher?.lastName || ''}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={editingTeacher?.email || ''}
                  required
                />
                <Input
                  label="Mobile"
                  name="mobile"
                  defaultValue={editingTeacher?.mobile || ''}
                  required
                />
                <Input
                  label="University"
                  name="university"
                  defaultValue={editingTeacher?.university || ''}
                />
                <Input
                  label="Department"
                  name="department"
                  defaultValue={editingTeacher?.department || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={editingTeacher?.bio || ''}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Teacher bio and expertise..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <div className="flex gap-2">
                  <Input
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="Enter skills separated by commas (e.g., JavaScript, Python, React)"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple skills with commas
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTeacher(null);
                    setSkillsInput('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Teachers ({teachers.length})</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>No teachers found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{teacher.firstName} {teacher.lastName}</h4>
                        <p className="text-xs text-muted-foreground">{teacher.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(teacher.isActive || false)}>
                          {getStatusText(teacher.isActive || false)}
                        </Badge>
                      </div>
                      {teacher.department && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Department:</span>
                          <span>{teacher.department}</span>
                        </div>
                      )}
                      {teacher.skills && teacher.skills.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {teacher.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {teacher.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{teacher.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTeacher(teacher)}
                        className="flex-1 opacity-50 cursor-not-allowed"
                        disabled
                        title="Institution users can only create accounts"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(teacher)}
                        className="flex-1 opacity-50 cursor-not-allowed"
                        disabled
                        title="Institution users cannot modify account status"
                      >
                        {teacher.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => teacher.id && handleDeleteTeacher(teacher.id)}
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
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Skills</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b hover:bg-muted">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
                          <div className="text-sm text-muted-foreground">{teacher.mobile}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{teacher.email}</td>
                      <td className="py-3 px-4">{teacher.department || '-'}</td>
                      <td className="py-3 px-4">
                        {teacher.skills && teacher.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {teacher.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{teacher.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(teacher.isActive || false)}>
                          {getStatusText(teacher.isActive || false)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTeacher(teacher)}
                            className="opacity-50 cursor-not-allowed"
                            disabled
                            title="Institution users can only create accounts"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(teacher)}
                            className="opacity-50 cursor-not-allowed"
                            disabled
                            title="Institution users cannot modify account status"
                          >
                            {teacher.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => teacher.id && handleDeleteTeacher(teacher.id)}
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
