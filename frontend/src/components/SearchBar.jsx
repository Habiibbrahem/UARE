import { FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isMobile = false, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            if (onSearch) onSearch();
        }
    };

    return (
        <form onSubmit={handleSearch} className={`search-form ${isMobile ? 'mobile-search' : ''}`}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="search-submit">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBar;