"use client";
import { useState, useEffect } from "react";
import PromptCard from "@components/PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [prompts, setPrompts] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPrompts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setPrompts(data);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const filteredPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");

    return prompts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = async (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filteredPrompts(e.target.value);

        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = async (tagName) => {
    setSearchText(tagName);

    const searchResult = filteredPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={prompts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
