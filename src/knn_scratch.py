"""
Movie Recommendation System using KNN with Cosine Similarity

This module implements a K-Nearest Neighbors recommendation system for movies
using cosine similarity between TF-IDF vectors and genre features.

The system uses pre-computed TF-IDF vectors combined with genre information
to find movies similar to a query movie based on both content and genre similarity.
"""

import numpy as np
import pandas as pd
import scipy.sparse as sparse
from typing import List, Tuple, Optional

class MovieRecommender:
    """
    A movie recommendation system using KNN with cosine similarity.
    
    This class provides methods to recommend movies similar to a query movie
    based on their descriptions (TF-IDF vectors) and genres.
    
    Attributes:
        data_path (str): Path to the CSV file containing movie information
        matrix_path (str): Path to the NPZ file containing the feature matrix
        df (pd.DataFrame): DataFrame containing movie information
        final_matrix (sparse.csr_matrix): Combined TF-IDF and genre feature matrix
        k (int): Number of recommendations to return
    """
    
    def __init__(self, data_path: str, matrix_path: str, k: int = 5):
        """
        Initialize the recommender system.
        
        Args:
            data_path (str): Path to the movies CSV file
            matrix_path (str): Path to the pre-computed feature matrix
            k (int, optional): Number of recommendations to return. Defaults to 5.
        """
        self.data_path = data_path
        self.matrix_path = matrix_path
        self.k = k
        
        # Load data
        self.df = pd.read_csv(data_path)
        self.final_matrix = sparse.load_npz(matrix_path)
        
        # Calculate norms for all movies (pre-computed)
        self.movie_norms = sparse.linalg.norm(self.final_matrix, axis=1)
        
    def _get_movie_index(self, title: str) -> Optional[int]:
        """
        Get the index of a movie by its title.
        
        Args:
            title (str): The title of the movie to look up
            
        Returns:
            Optional[int]: Index of the movie if found, None if not found
        """
        matches = self.df[self.df['title'].str.lower() == title.lower()].index
        return matches[0] if len(matches) > 0 else None
    
    def _calculate_similarity(self, query_vec: sparse.csr_matrix) -> np.ndarray:
        """
        Calculate cosine similarity between query vector and all movies.
        
        Args:
            query_vec (sparse.csr_matrix): Feature vector of the query movie
            
        Returns:
            np.ndarray: Array of cosine similarity scores
        """
        # Calculate dot products (sparse @ sparse)
        dot_products = self.final_matrix.dot(query_vec.T).toarray().flatten()
        
        # Calculate query norm
        norm_query = sparse.linalg.norm(query_vec)
        
        # Calculate cosine similarity
        return dot_products / (self.movie_norms * norm_query + 1e-10)
    
    def get_recommendations(self, title: str) -> List[dict]:
        """
        Get movie recommendations based on a query movie title.
        
        Args:
            title (str): Title of the movie to base recommendations on
            
        Returns:
            List[dict]: List of dictionaries containing movie details (title, similarity, id)
            
        Raises:
            ValueError: If the movie title is not found in the database
        """
        # Find movie index
        query_index = self._get_movie_index(title)
        if query_index is None:
            raise ValueError(f"Movie '{title}' not found in database")
            
        # Get query vector and calculate similarities
        query_vec = self.final_matrix[query_index]
        cosine_sims = self._calculate_similarity(query_vec)
        
        # Get top k similar movies (excluding the query movie itself)
        top_indices = np.argsort(cosine_sims)[::-1][1:self.k+1]
        
        # Return movie titles and similarity scores
        recommendations = []
        for idx in top_indices:
            row = self.df.iloc[idx]
            recommendations.append({
                'title': row['title'],
                'similarity': cosine_sims[idx],
                'id': int(row['id'])
            })
            
        return recommendations

    def get_movie_details(self, title: str) -> dict:
        """
        Get details of a specific movie.
        
        Args:
            title (str): Title of the movie
            
        Returns:
            dict: Dictionary containing movie details (title, id)
            
        Raises:
            ValueError: If the movie title is not found
        """
        query_index = self._get_movie_index(title)
        if query_index is None:
            raise ValueError(f"Movie '{title}' not found in database")
            
        row = self.df.iloc[query_index]
        return {
            'title': row['title'],
            'id': int(row['id'])
        }

def main():
    """Example usage of the MovieRecommender class."""
    # Initialize paths
    data_path = 'F:/Codes/Python/ML/ML-fundamentals/Projects/04-Movie-Recommendation-System/movies.csv'
    matrix_path = 'F:/Codes/Python/ML/ML-fundamentals/Projects/04-Movie-Recommendation-System/final_matrix.npz'
    
    # Create recommender instance
    recommender = MovieRecommender(data_path, matrix_path, k=5)
    
    # Get recommendations for a movie
    query_title = "Shutter Island"
    try:
        recommendations = recommender.get_recommendations(query_title)
        
        print(f"\nTop 5 movies similar to '{query_title}':")
        print("-" * 50)
        for title, score in recommendations:
            print(f"• {title:<40} (similarity: {score:.3f})")
            
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
