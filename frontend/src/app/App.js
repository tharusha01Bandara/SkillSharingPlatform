import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import Home from '../home/home/Home';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import OAuth2RedirectHandler from '../user/oauth2/OAuth2RedirectHandler';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';
import PrivateRoute from '../common/PrivateRoute';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import './App.css';
import AddCourse from '../components/AddCourse';
import CourseList from '../components/CourseList';
import CourseTable from '../components/CourseTable';
import UpdateCourse from '../components/UpdateCourse';

import AddSkillPost from '../components/AddSkillPost';
import SkillPostList from '../components/SkillPostList';
import SkillPostDetail from '../components/SkillPostDetail';
import EditSkillPost from '../components/EditSkillPost';
import UserSearch from '../components/UserSearch';

import Header from "../home/common/header/Header";
import About from '../home/about/About';
import CourseHome from '../home/allcourses/CourseHome';
import Team from '../home/team/Team';
import Pricing from '../home/pricing/Pricing';
import Blog from '../home/blog/Blog';
import Contact from '../home/contact/Contact';
import Footer from '../home/common/footer/Footer';

import LearningPlanList from '../components/LearningPlanList';
import LearningPlanForm from '../components/LearningPlanForm';
import LearningPlanCard from '../components/LearningPlanCard';
import EditLearningPlan from '../components/EditLearningPlan';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: true
    };
    
    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
  }
  
  loadCurrentlyLoggedInUser() {
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        authenticated: true,
        loading: false
      });
    })
    .catch(() => {
      this.setState({ loading: false });
    });
  }
  
  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null
    });
    Alert.success("You're safely logged out!");
  }
  
render() {
  if (this.state.loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="app">
      <div className="app-top-box">
        <AppHeader authenticated={this.state.authenticated} onLogout={this.handleLogout} />
      </div>
      <div className="app-body">
        <Switch>
          {/* Home and Static Pages */}
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/courses" component={CourseHome} />
          <Route exact path="/team" component={Team} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/journal" component={Blog} />
          <Route exact path="/contact" component={Contact} />

          {/* Course Management */}
          <Route exact path="/ADDcourse" component={AddCourse} />
          <Route path="/coursesTable" component={CourseTable} />
          <Route path="/update-course/:id" component={UpdateCourse} />
          <Route path="/CourseList" component={CourseList} />

          {/* Skill Posts */}
          <Route exact path="/AddSkillPost" component={AddSkillPost} />
          <Route exact path="/SkillPostList" component={SkillPostList} />
          <Route exact path="/skill-post/:postId" component={SkillPostDetail} />
          <Route exact path="/edit-skill-post/:postId" component={EditSkillPost} />

          {/* Learning Plans */}
          <Route exact path="/LearningPlanForm" component={LearningPlanForm} />
          <Route exact path="/LearningPlanCard" component={LearningPlanCard} />
          <Route exact path="/LearningPlanList" component={LearningPlanList} />
          <Route exact path="/create-learning-plan" component={LearningPlanForm} />
          <Route exact path="/edit-learning-plan/:id" component={LearningPlanForm} />

          
<Route exact path="/search-users" component={UserSearch} />

          {/* User Profile */}
          <PrivateRoute 
            path="/profile" 
            authenticated={this.state.authenticated} 
            currentUser={this.state.currentUser}
            component={Profile}
          />

          {/* Auth Routes */}
          <Route 
            path="/login"
            render={(props) => <Login authenticated={this.state.authenticated} {...props} />}
          />
          <Route 
            path="/signup"
            render={(props) => <Signup authenticated={this.state.authenticated} {...props} />}
          />
          <Route path="/oauth2/redirect" component={OAuth2RedirectHandler} />

          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>

      {/* Footer visible on all pages */}
      <Footer />

      {/* Alert */}
      <Alert
        stack={{ limit: 3 }}
        timeout={3000}
        position="top-right"
        effect="slide"
        offset={65}
      />
    </div>
  );
}
}

export default App;