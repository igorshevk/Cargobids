import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';
import {isSubscribed, isShowWelcome} from '../../helpers/API';
import { URL_PREFIX } from '../../constants/defaultValues'
import { isLoggedIn } from "../../helpers/API";

// Added by me
const AuthRoute = ({ component: Component, isSubscribed, ...rest }) => {
  return (
      <Route
          {...rest}
          render={props =>
              isSubscribed() && !isShowWelcome() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/agent/welcome',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};
const MembershipRoute = ({ component: Component, isSubscribed, ...rest }) => {
  return (

      <Route
          {...rest}
          render={props =>
              !isSubscribed() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/agent/dashboard',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};

const MembershipWelcomRoute = ({ component: Component, isSubscribed, ...rest }) => {
  return (

      <Route
          {...rest}
          render={props =>
              isSubscribed() && isShowWelcome() ? (
                  <Component {...props} />
              ) : (
                  <Redirect
                      to={{
                        pathname: '/'+URL_PREFIX+'/agent/membership',
                        state: { from: props.location }
                      }}
                  />
              )
          }
      />
  );
};


const MembershipPage = React.lazy(() =>
  import('../account/membership')
);

const SubscriptionSuccess = React.lazy(() =>
  import('../account/subscription-success')
);

const QuotesPage = React.lazy(() =>
  import('./quotes')
);

const CreateQuotePage = React.lazy(() =>
  import('./createQuote')
);

const ReviewQuotePage = React.lazy(() =>
  import('./reviewQuote')
);

const ChatPage = React.lazy(() =>
  import('./chat')
);

const ViewQuotePage = React.lazy(() =>
  import('./viewQuote')
);

const dashboardPage = React.lazy(() =>
  import('./dashboard')
);

const UpdateQuotePage = React.lazy(() =>
  import('./updateQuote')
);

const BidDetailPage = React.lazy(() =>
  import('../airline/bidDetail')
);

const ReplyQuest = React.lazy(() =>
  import('./replyToQues')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
                   <MembershipRoute
                      path={`${match.url}/membership`}
                      isSubscribed={isSubscribed}
                      component={MembershipPage}
                  />

                   <MembershipWelcomRoute
                      path={`${match.url}/welcome`}
                      isSubscribed={isSubscribed}
                      isShowWelcome={isShowWelcome}
                      component={SubscriptionSuccess}
                  />

                  <AuthRoute
                      path={`${match.url}/quotes/:id/review`}
                      isSubscribed={isSubscribed}
                      component={ReviewQuotePage}
                  />
                <AuthRoute
                  path={`${match.url}/quotes/reply/`}
                  isSubscribed={isSubscribed}
                  component={ReplyQuest}
                />
                  <AuthRoute exact
                      path={`${match.url}/quotes`}
                      isSubscribed={isSubscribed}
                      component={QuotesPage}
                  />
                  <AuthRoute
                      path={`${match.url}/quotes/create`}
                      isSubscribed={isSubscribed}
                      component={CreateQuotePage}
                  />
                  <AuthRoute
                      path={`${match.url}/quotes/:id/view`}
                      isSubscribed={isSubscribed}
                      component={ViewQuotePage}
                  />
                  <AuthRoute
                      path={`${match.url}/chat`}
                      isSubscribed={isSubscribed}
                      component={ChatPage}
                  />
                  <AuthRoute
                      path={`${match.url}/dashboard`}
                      isSubscribed={isSubscribed}
                      component={dashboardPage}
                  />
                  <AuthRoute
                      path={`${match.url}/quotes/:id/update`}
                      isSubscribed={isSubscribed}
                      component={UpdateQuotePage}
                  />
                  <AuthRoute
                      path={`${match.url}/quotes/:id/bids/:bid_id/detail`}
                      isSubscribed={isSubscribed}
                      component={BidDetailPage}
                  />


            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
