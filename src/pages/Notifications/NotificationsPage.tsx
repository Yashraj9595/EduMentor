import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Notifications } from './Notifications';

export const NotificationsPage: React.FC = () => {
  return (
    <PageLayout title="Notifications" showBackButton>
      <div className="pt-2">
        <Notifications />
      </div>
    </PageLayout>
  );
};