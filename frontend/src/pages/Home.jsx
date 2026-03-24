import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Truck, 
  Clock, 
  Star, 
  ChevronRight,
  ChefHat,
  ShieldCheck,
  Headphones
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Delicious Food',
      description: 'Wide variety of cuisines from top-rated restaurants'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Order anytime, day or night'
    },
    {
      icon: Star,
      title: 'Best Quality',
      description: 'Only the freshest ingredients and best chefs'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Choose Your Food',
      description: 'Browse our extensive menu and select your favorites'
    },
    {
      step: '2',
      title: 'Place Your Order',
      description: 'Add items to cart and proceed to checkout'
    },
    {
      step: '3',
      title: 'Fast Delivery',
      description: 'Sit back and relax while we deliver to your door'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '500+', label: 'Food Items' },
    { value: '30min', label: 'Avg Delivery' },
    { value: '4.9', label: 'App Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 mr-2" />
                #1 Food Delivery App
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Delicious Food<br />
                <span className="text-primary-500">Delivered Fast</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Order from the best restaurants in your area. Fresh, hot, and delivered to your doorstep in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="btn-primary inline-flex items-center text-lg"
                >
                  Order Now
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="btn-outline inline-flex items-center text-lg"
                >
                  Sign Up Free
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=500&fit=crop"
                  alt="Delicious Food"
                  className="rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=500&fit=crop';
                  }}
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-500">FoodHub</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best food delivery experience with quality service and delicious meals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover bg-gray-50 rounded-2xl p-8 text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-primary-500">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting your favorite food is easy with our simple 3-step process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                  <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="gradient-primary rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Order?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start enjoying delicious food delivered to your doorstep
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/menu"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                <UtensilsCrossed className="h-5 w-5 mr-2" />
                Browse Menu
              </Link>
              <Link
                to="/register"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors inline-flex items-center border-2 border-white/30"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FoodHub</span>
              </div>
              <p className="text-gray-400">
                Your favorite food delivery partner. Fast, reliable, and delicious.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><Headphones className="h-4 w-4 mr-2" /> 24/7 Support</li>
                <li className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2" /> Secure Payment</li>
                <li className="flex items-center"><ChefHat className="h-4 w-4 mr-2" /> Quality Food</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@foodhub.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Food Street, NY</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FoodHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
