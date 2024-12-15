import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [activeTab, setActiveTab] = useState("repositories");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`3.111.40.160:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`3.111.40.160:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error fetching suggested repositories: ", err);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`3.111.40.160:3000/user/${userId}`);
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "repositories":
        return (
          <div>
            <h2>Your Repositories</h2>
            <div id="search">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.map((repo) => (
              <div className="repo-card" key={repo._id}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <div className="repo-stats">
                  <span>Stars: {repo.stars}</span>
                  <span>Forks: {repo.forks}</span>
                  <span>Watchers: {repo.watchers}</span>
                </div>
                <button onClick={() => window.open(repo.html_url, "_blank")}>View on GitHub</button>
              </div>
            ))}
          </div>
        );

      case "pull-requests":
        return <h2>Pull Requests (Coming Soon)</h2>;

      case "issues":
        return <h2>Issues (Coming Soon)</h2>;

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="sidebar">
          <div className="user-profile">
            <img src={userProfile.avatar_url} alt="User Avatar" />
            <h3>{userProfile.name}</h3>
            <p>{userProfile.bio}</p>
          </div>
          <div className="suggested-repos">
            <h3>Suggested Repositories</h3>
            {suggestedRepositories.map((repo) => (
              <div key={repo._id} className="suggested-repo">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))}
          </div>
        </aside>
        <main>
          <div className="tabs">
            <button
              className={activeTab === "repositories" ? "active" : ""}
              onClick={() => setActiveTab("repositories")}
            >
              Repositories
            </button>
            <button
              className={activeTab === "pull-requests" ? "active" : ""}
              onClick={() => setActiveTab("pull-requests")}
            >
              Pull Requests
            </button>
            <button
              className={activeTab === "issues" ? "active" : ""}
              onClick={() => setActiveTab("issues")}
            >
              Issues
            </button>
          </div>
          {renderTabContent()}
        </main>
        <aside className="events">
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
