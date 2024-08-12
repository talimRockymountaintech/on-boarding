"use client"


import React, { ComponentType, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next-nprogress-bar';

const withAuth =  <P extends object>(WrappedComponent: ComponentType<P>): React.FC<P>  => {
    const Wrapper: React.FC<P> = (props: P) => {
        const { isLoggedIn } = useAuth();
        const router = useRouter();
        
        useEffect(() => {
            if (!isLoggedIn) {
                router.push('/'); // Redirect to login page if not authenticated
            }
        }, [isLoggedIn, router]);

        // If the user is not logged in, do not render the component
        if (!isLoggedIn) {
            return <div>Loading...</div>; // Or replace with your loading spinner
          }

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;
