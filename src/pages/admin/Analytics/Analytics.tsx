import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';

export const Analytics: React.FC = () => {
  return (
    <div className="w-full">
      {/* Mobile view - custom header */}
      <div className="md:hidden">
        <div className="w-full min-h-screen bg-background">
          {/* Custom centered header for mobile */}
          <div className="bg-background border-b border-border p-4 sticky top-0 z-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-4 pb-6">
            <div className="space-y-4 pt-2">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Page Views</span>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">45,234</div>
                    <div className="text-sm text-primary mt-1">+15.3% from last month</div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Bounce Rate</span>
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">32.5%</div>
                    <div className="text-sm text-destructive mt-1">-2.1% from last month</div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <Activity className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">1,234</div>
                    <div className="text-sm text-secondary mt-1">+8.7% from last month</div>
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-card-foreground">Traffic Overview</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart visualization would go here
                  </div>
                </CardBody>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-card-foreground">Top Pages</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {[
                        { page: '/dashboard', views: 12345, change: '+12%' },
                        { page: '/products', views: 9876, change: '+8%' },
                        { page: '/about', views: 5432, change: '+15%' },
                        { page: '/contact', views: 3210, change: '+3%' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{item.page}</p>
                            <p className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</p>
                          </div>
                          <span className="text-sm text-primary">{item.change}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-card-foreground">Traffic Sources</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-4">
                      {[
                        { source: 'Direct', percentage: 45, color: 'bg-primary' },
                        { source: 'Organic Search', percentage: 30, color: 'bg-secondary' },
                        { source: 'Social Media', percentage: 15, color: 'bg-accent' },
                        { source: 'Referral', percentage: 10, color: 'bg-muted' },
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-card-foreground">{item.source}</span>
                            <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block space-y-6 w-full p-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">View your detailed analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Page Views</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">45,234</div>
              <div className="text-sm text-primary mt-1">+15.3% from last month</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold text-foreground">32.5%</div>
              <div className="text-sm text-destructive mt-1">-2.1% from last month</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <Activity className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <div className="text-sm text-secondary mt-1">+8.7% from last month</div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-card-foreground">Traffic Overview</h2>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-card-foreground">Top Pages</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {[
                  { page: '/dashboard', views: 12345, change: '+12%' },
                  { page: '/products', views: 9876, change: '+8%' },
                  { page: '/about', views: 5432, change: '+15%' },
                  { page: '/contact', views: 3210, change: '+3%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.page}</p>
                      <p className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</p>
                    </div>
                    <span className="text-sm text-primary">{item.change}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-card-foreground">Traffic Sources</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {[
                  { source: 'Direct', percentage: 45, color: 'bg-primary' },
                  { source: 'Organic Search', percentage: 30, color: 'bg-secondary' },
                  { source: 'Social Media', percentage: 15, color: 'bg-accent' },
                  { source: 'Referral', percentage: 10, color: 'bg-muted' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-card-foreground">{item.source}</span>
                      <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};