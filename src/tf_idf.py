import math
import numpy as np
import pandas as pd
from collections import Counter
import re
from typing import List, Dict
from scipy import sparse

class CustomTfidfVectorizer:
    def __init__(self, stop_words='english', max_features=None):
        self.stop_words = self._get_stop_words() if stop_words == 'english' else set(stop_words)
        self.max_features = max_features
        self.vocabulary_ = {}
        self.idf_ = None
        
    def _get_stop_words(self) -> set:
        """Default English stop words"""
        return set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", 
                   "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 
                   'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 
                   'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
                   'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 
                   'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 
                   'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 
                   'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 
                   'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 
                   'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 
                   'further', 'then', 'once'])

    def _preprocess_text(self, text: str) -> List[str]:
        """Clean and tokenize text"""
        # Convert to lowercase and split into words
        text = text.lower()
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        # Split into words and remove stop words
        words = [word for word in text.split() if word not in self.stop_words]
        return words

    def _compute_tf(self, document: List[str]) -> Dict[str, float]:
        """Compute Term Frequency for a document"""
        # Count word frequencies
        word_counts = Counter(document)
        # Normalize by document length
        doc_length = len(document)
        return {word: count/doc_length for word, count in word_counts.items()}

    def _compute_idf(self, documents: List[List[str]]) -> None:
        """Compute Inverse Document Frequency for all terms"""
        N = len(documents)
        # Count document frequency for each term
        doc_frequency = Counter()
        for doc in documents:
            doc_frequency.update(set(doc))  # Count each term only once per document

        # Compute IDF
        self.idf_ = {term: np.log((N + 1)/(df + 1)) + 1 for term, df in doc_frequency.items()}

        # If max_features is set, keep only the top terms by IDF value
        if self.max_features is not None:
            sorted_terms = sorted(self.idf_.items(), key=lambda x: x[1], reverse=True)
            top_terms = sorted_terms[:self.max_features]
            self.idf_ = dict(top_terms)

        # Create vocabulary mapping
        self.vocabulary_ = {term: idx for idx, term in enumerate(self.idf_.keys())}

    def fit_transform(self, raw_documents: List[str]) -> sparse.csr_matrix:
        """Fit the vectorizer and transform the documents into a sparse matrix"""
        # Preprocess all documents
        processed_docs = [self._preprocess_text(doc) for doc in raw_documents]
        
        # Compute IDF
        self._compute_idf(processed_docs)
        
        # Initialize lists to construct sparse matrix
        rows = []
        cols = []
        data = []
        
        # Compute TF-IDF for each document
        for doc_idx, doc in enumerate(processed_docs):
            tf = self._compute_tf(doc)
            for term, tf_value in tf.items():
                if term in self.vocabulary_:  # Only consider terms in our vocabulary
                    term_idx = self.vocabulary_[term]
                    tfidf_value = tf_value * self.idf_.get(term, 0)
                    rows.append(doc_idx)
                    cols.append(term_idx)
                    data.append(tfidf_value)
        
        # Create sparse matrix
        X = sparse.csr_matrix((data, (rows, cols)), 
                            shape=(len(raw_documents), len(self.vocabulary_)))
        
        # Normalize the vectors to unit length (L2 norm)
        return normalize_sparse_matrix(X)

    def transform(self, raw_documents: List[str]) -> sparse.csr_matrix:
        """Transform new documents using the fitted vectorizer"""
        if not self.vocabulary_:
            raise ValueError("Vectorizer needs to be fitted before transform")
        
        # Initialize lists to construct sparse matrix
        rows = []
        cols = []
        data = []
        
        # Process each document
        for doc_idx, doc in enumerate(raw_documents):
            processed_doc = self._preprocess_text(doc)
            tf = self._compute_tf(processed_doc)
            
            for term, tf_value in tf.items():
                if term in self.vocabulary_:
                    term_idx = self.vocabulary_[term]
                    tfidf_value = tf_value * self.idf_.get(term, 0)
                    rows.append(doc_idx)
                    cols.append(term_idx)
                    data.append(tfidf_value)
        
        # Create sparse matrix
        X = sparse.csr_matrix((data, (rows, cols)), 
                            shape=(len(raw_documents), len(self.vocabulary_)))
        
        # Normalize the vectors
        return normalize_sparse_matrix(X)

def normalize_sparse_matrix(X: sparse.csr_matrix) -> sparse.csr_matrix:
    """Normalize sparse matrix rows to unit length (L2 norm)"""
    # Calculate L2 norm for each row
    norms = sparse.linalg.norm(X, axis=1)
    norms[norms == 0] = 1  # Prevent division by zero
    
    # Create diagonal matrix with 1/norm values
    normalizer = sparse.diags(1/norms.A.ravel())
    
    # Multiply by normalizer to get normalized matrix
    return normalizer @ X

def compare_with_sklearn(text_data):
    """Compare custom TF-IDF with sklearn's implementation"""
    from sklearn.feature_extraction.text import TfidfVectorizer as SklearnTfidfVectorizer
    
    # Custom implementation
    custom_vectorizer = CustomTfidfVectorizer(max_features=500)
    custom_tfidf = custom_vectorizer.fit_transform(text_data)
    
    # Sklearn implementation
    sklearn_vectorizer = SklearnTfidfVectorizer(max_features=500)
    sklearn_tfidf = sklearn_vectorizer.fit_transform(text_data)
    
    print("Custom TF-IDF shape:", custom_tfidf.shape)
    print("Sklearn TF-IDF shape:", sklearn_tfidf.shape)
    
    # Compare the results (note: exact values might differ due to implementation details)
    custom_dense = custom_tfidf.toarray()
    sklearn_dense = sklearn_tfidf.toarray()
    
    # Calculate cosine similarity between the two matrices
    similarity = np.sum(custom_dense * sklearn_dense) / (
        np.sqrt(np.sum(custom_dense * custom_dense)) * 
        np.sqrt(np.sum(sklearn_dense * sklearn_dense))
    )
    
    print(f"\nCosine similarity between custom and sklearn implementations: {similarity:.4f}")
    return custom_tfidf, sklearn_tfidf

if __name__ == "__main__":
    # Load your movie data
    df = pd.read_csv('movies.csv')
    overviews = df['overview'].fillna('').values
    
    # Compare implementations
    custom_tfidf, sklearn_tfidf = compare_with_sklearn(overviews)