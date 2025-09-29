import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save,
  Add,
  Edit,
  Delete,
  PersonAdd,
  AdminPanelSettings,
  Person,
  InfoOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '../../api/dashboardAPI';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'executive' | 'pm' | 'tpm' | 'em' | 'sre';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface NewUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'executive' | 'pm' | 'tpm' | 'em' | 'sre';
}

const UserManagementForm: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [newUser, setNewUser] = useState<NewUserData>({
    name: '',
    email: '',
    password: '',
    role: 'pm',
  });

  const queryClient = useQueryClient();

  // Fetch users (mock data for now)
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Mock data - in real app this would be an API call
      return {
        data: {
          data: [
            {
              id: 1,
              name: 'Admin User',
              email: 'admin@livpulse.com',
              role: 'admin' as const,
              isActive: true,
              lastLogin: '2024-01-15T10:30:00Z',
              createdAt: '2024-01-01T00:00:00Z',
            },
            {
              id: 2,
              name: 'John Executive',
              email: 'john.exec@livpulse.com',
              role: 'executive' as const,
              isActive: true,
              lastLogin: '2024-01-15T09:15:00Z',
              createdAt: '2024-01-05T00:00:00Z',
            },
            {
              id: 3,
              name: 'Sarah PM',
              email: 'sarah.pm@livpulse.com',
              role: 'pm' as const,
              isActive: true,
              lastLogin: '2024-01-15T11:45:00Z',
              createdAt: '2024-01-10T00:00:00Z',
            },
          ] as User[]
        }
      };
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: NewUserData) => dashboardAPI.updateUserData({ action: 'create', data: userData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowDialog(false);
      setNewUser({ name: '', email: '', password: '', role: 'pm' });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<User>) => dashboardAPI.updateUserData({ action: 'update', data: userData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => dashboardAPI.updateUserData({ action: 'delete', userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate(newUser);
  };

  const handleUpdateUser = (user: User) => {
    updateUserMutation.mutate(user);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const roleColors = {
    admin: 'error',
    executive: 'primary',
    pm: 'success',
    tpm: 'info',
    em: 'warning',
    sre: 'secondary',
  } as const;

  const roleLabels = {
    admin: 'Administrator',
    executive: 'Executive',
    pm: 'Product Manager',
    tpm: 'Technical Program Manager',
    em: 'Engineering Manager',
    sre: 'Site Reliability Engineer',
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts, roles, and permissions for the Livpulse platform
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <FormControlLabel
            control={
              <Switch
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                size="small"
              />
            }
            label="Show Passwords"
          />
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setShowDialog(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load users: {error.message}
        </Alert>
      )}

      {createUserMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create user: {createUserMutation.error.message}
        </Alert>
      )}

      {updateUserMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to update user: {updateUserMutation.error.message}
        </Alert>
      )}

      {(createUserMutation.isSuccess || updateUserMutation.isSuccess) && (
        <Alert severity="success" sx={{ mb: 2 }}>
          User operation completed successfully!
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            System Users ({users?.data?.data?.length || 0})
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.data?.data?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {user.role === 'admin' && <AdminPanelSettings fontSize="small" />}
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={roleLabels[user.role]}
                        color={roleColors[user.role]}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {user.role !== 'admin' && (
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlined />
              Role Permissions
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(roleLabels).map(([role, label]) => (
                <Grid item xs={12} sm={6} md={4} key={role}>
                  <Box p={2} border={1} borderColor="divider" borderRadius={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Chip
                        label={label}
                        color={roleColors[role as keyof typeof roleColors]}
                        size="small"
                        variant="outlined"
                      />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {role === 'admin' && 'Full system access, user management, all data input'}
                      {role === 'executive' && 'Executive dashboards, reports, high-level metrics'}
                      {role === 'pm' && 'Product metrics, feature tracking, limited data input'}
                      {role === 'tpm' && 'Technical metrics, project tracking, limited data input'}
                      {role === 'em' && 'Engineering metrics, team data, limited data input'}
                      {role === 'sre' && 'System metrics, operational data, read-only access'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={showDialog || editingUser !== null} onClose={() => {
        setShowDialog(false);
        setEditingUser(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={(e) => {
                  if (editingUser) {
                    setEditingUser({ ...editingUser, name: e.target.value });
                  } else {
                    setNewUser({ ...newUser, name: e.target.value });
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={(e) => {
                  if (editingUser) {
                    setEditingUser({ ...editingUser, email: e.target.value });
                  } else {
                    setNewUser({ ...newUser, email: e.target.value });
                  }
                }}
              />
            </Grid>
            {!editingUser && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPasswords ? 'text' : 'password'}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPasswords(!showPasswords)}
                        edge="end"
                      >
                        {showPasswords ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editingUser ? editingUser.role : newUser.role}
                  onChange={(e) => {
                    const role = e.target.value as typeof newUser.role;
                    if (editingUser) {
                      setEditingUser({ ...editingUser, role });
                    } else {
                      setNewUser({ ...newUser, role });
                    }
                  }}
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowDialog(false);
            setEditingUser(null);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editingUser) {
                handleUpdateUser(editingUser);
              } else {
                handleCreateUser();
              }
            }}
            disabled={createUserMutation.isPending || updateUserMutation.isPending}
          >
            {editingUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementForm;