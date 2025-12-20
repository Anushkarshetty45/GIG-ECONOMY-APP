import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { SavingsGoalsScreen } from '../screens/SavingsGoalsScreen';
import { IncomeScreen } from '../screens/IncomeScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ReceiptScannerScreen } from '../screens/ReceiptScannerScreen';
import { ExportToolsScreen } from '../screens/ExportToolsScreen';
import { TaxToolsScreen } from '../screens/TaxToolsScreen';
import { InsuranceScreen } from '../screens/InsuranceScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator for authenticated users
const MainTabs = () => {
  const { theme } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundAlt,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Income':
              iconName = 'attach-money';
              break;
            case 'Expenses':
              iconName = 'receipt';
              break;
            case 'Analytics':
              iconName = 'bar-chart';
              break;
            case 'More':
              iconName = 'menu';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Income"
        component={IncomeScreen}
        options={{ title: 'Income' }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: 'Expenses' }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
};

// More Screen with additional options
const MoreScreen = ({ navigation }) => {
  const { theme } = useThemeStore();

  const menuItems = [
    { id: 'goals', label: 'Goals', icon: 'flag', screen: 'SavingsGoals', description: 'Set and track savings goals' },
    { id: 'receipts', label: 'Receipts', icon: 'camera-alt', screen: 'ReceiptScanner', description: 'Scan and manage receipts' },
    { id: 'export', label: 'Export', icon: 'download', screen: 'ExportTools', description: 'Export your financial data' },
    { id: 'tax', label: 'Tax Tools', icon: 'account-balance', screen: 'TaxTools', description: 'Tax preparation tools' },
    { id: 'insurance', label: 'Insurance', icon: 'security', screen: 'Insurance', description: 'Manage insurance policies' },
  ];

  return (
    <View style={[styles.moreContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.moreHeader}>
        <Text style={[styles.moreTitle, { color: theme.colors.text }]}>More</Text>
      </View>
      <ScrollView style={styles.moreScroll}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.moreItem}
          >
            <View style={[styles.moreItemIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <MaterialIcons name={item.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.moreItemContent}>
              <Text style={[styles.moreItemLabel, { color: theme.colors.text }]}>{item.label}</Text>
              <Text style={[styles.moreItemDescription, { color: theme.colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  moreContainer: {
    flex: 1,
  },
  moreHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  moreTitle: {
    fontSize: 32,
    fontWeight: '800',
  },
  moreScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  moreItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moreItemContent: {
    flex: 1,
  },
  moreItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moreItemDescription: {
    fontSize: 13,
  },
});

// Auth Navigator
const AuthNavigator = () => {
  const { theme } = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
    </Stack.Navigator>
  );
};

// Main Stack (includes tabs + modal screens)
const MainStack = () => {
  const { theme } = useThemeStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen name="SavingsGoals" component={SavingsGoalsScreen} />
      <Stack.Screen name="ReceiptScanner" component={ReceiptScannerScreen} />
      <Stack.Screen name="ExportTools" component={ExportToolsScreen} />
      <Stack.Screen name="TaxTools" component={TaxToolsScreen} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} />
    </Stack.Navigator>
  );
};

// App Navigator
export const AppNavigator = () => {
  const { theme } = useThemeStore();
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer
      theme={{
        colors: {
          background: theme.colors.background,
          card: theme.colors.backgroundAlt,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary,
        },
      }}
    >
      {user ? <MainStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
