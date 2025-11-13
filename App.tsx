
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ItemList from './components/Items/ItemList';
import AddItemPage from './components/Items/AddItemPage';
import MyItemsPage from './components/Items/MyItemsPage';
import MyFavoritesPage from './components/Items/MyFavoritesPage';
import ItemDetailPage from './components/Items/ItemDetailPage';
import EditItemPage from './components/Items/EditItemPage';
import { View } from './types';
import Chatbot from './components/Chat/Chatbot';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>({ page: 'home' });
  const { isAuthenticated } = useAuth();

  const navigate = useCallback((view: View) => {
    if (!isAuthenticated && (view.page === 'addItem' || view.page === 'myItems' || view.page === 'myFavorites' || view.page === 'editItem')) {
      setCurrentView({ page: 'login' });
    } else {
      setCurrentView(view);
    }
  }, [isAuthenticated]);

  const renderPage = () => {
    switch (currentView.page) {
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'addItem':
        return <AddItemPage onNavigate={navigate} />;
      case 'myItems':
        return <MyItemsPage onNavigate={navigate} />;
      case 'myFavorites':
        return <MyFavoritesPage onNavigate={navigate} />;
      case 'itemDetail':
        return <ItemDetailPage itemId={currentView.itemId} onNavigate={navigate} />;
      case 'editItem':
        return <EditItemPage itemId={currentView.itemId} onNavigate={navigate} />;
      case 'home':
      default:
        return <ItemList onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200 font-sans">
      <Header onNavigate={navigate} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
      <Chatbot onNavigate={navigate} currentView={currentView} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;