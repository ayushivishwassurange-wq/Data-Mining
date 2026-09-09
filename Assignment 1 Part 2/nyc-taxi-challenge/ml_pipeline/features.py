import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

# Key NYC Airport Coordinates (lon, lat)
JFK_COORDS = (-73.7781, 40.6413)
LGA_COORDS = (-73.8740, 40.7769)
EWR_COORDS = (-74.1745, 40.6895)
NYC_CENTER = (-73.9855, 40.7484) # Empire State Building

def haversine_distance(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) in miles.
    Supports both numpy arrays and scalar floats.
    """
    lon1, lat1, lon2, lat2 = np.asarray(lon1, dtype=float), np.asarray(lat1, dtype=float), np.asarray(lon2, dtype=float), np.asarray(lat2, dtype=float)
    
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = np.sin(dlat / 2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2.0)**2
    c = 2 * np.arcsin(np.sqrt(a))
    miles = 3958.8 * c # Earth radius in miles
    return miles

def manhattan_distance(lon1, lat1, lon2, lat2):
    """
    Calculate Manhattan / Taxicab grid distance in miles.
    """
    lon1, lat1, lon2, lat2 = np.asarray(lon1, dtype=float), np.asarray(lat1, dtype=float), np.asarray(lon2, dtype=float), np.asarray(lat2, dtype=float)
    lat_dist = np.abs(lat2 - lat1) * 69.0
    lon_dist = np.abs(lon2 - lon1) * 52.0
    return lat_dist + lon_dist

def calculate_bearing(lon1, lat1, lon2, lat2):
    """
    Calculate compass bearing (direction in degrees 0-360) from point 1 to point 2.
    """
    lon1, lat1, lon2, lat2 = np.asarray(lon1, dtype=float), np.asarray(lat1, dtype=float), np.asarray(lon2, dtype=float), np.asarray(lat2, dtype=float)
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1) * np.sin(lat2) - (np.sin(lat1) * np.cos(lat2) * np.cos(dlon))
    
    initial_bearing = np.arctan2(x, y)
    initial_bearing = np.degrees(initial_bearing)
    compass_bearing = (initial_bearing + 360) % 360
    return compass_bearing

class NYCTaxiFeatureExtractor(BaseEstimator, TransformerMixin):
    """
    Feature engineering transformer for NYC Taxi Fare Prediction following CRISP-DM standards.
    """
    def __init__(self):
        self.feature_names_ = []

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = X.copy() if isinstance(X, pd.DataFrame) else pd.DataFrame(X)

        # Parse pickup datetime
        if not pd.api.types.is_datetime64_any_dtype(df['pickup_datetime']):
            dt = pd.to_datetime(df['pickup_datetime'])
        else:
            dt = df['pickup_datetime']

        # Temporal Features
        df['hour'] = dt.dt.hour
        df['day_of_week'] = dt.dt.dayofweek
        df['day_of_month'] = dt.dt.day
        df['month'] = dt.dt.month
        df['year'] = dt.dt.year
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        
        # Rush hour (4 PM - 8 PM on weekdays)
        df['is_rush_hour'] = ((df['hour'] >= 16) & (df['hour'] <= 20) & (df['is_weekend'] == 0)).astype(int)
        # Late night surcharge (8 PM - 6 AM)
        df['is_late_night'] = ((df['hour'] >= 20) | (df['hour'] <= 6)).astype(int)

        # Cyclical Temporal Encodings
        df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24.0)
        df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24.0)
        df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12.0)
        df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12.0)
        df['sin_dayofweek'] = np.sin(2 * np.pi * df['day_of_week'] / 7.0)
        df['cos_dayofweek'] = np.cos(2 * np.pi * df['day_of_week'] / 7.0)

        # Geospatial Distance Features
        p_lon = df['pickup_longitude'].values
        p_lat = df['pickup_latitude'].values
        d_lon = df['dropoff_longitude'].values
        d_lat = df['dropoff_latitude'].values

        df['abs_lat_diff'] = np.abs(d_lat - p_lat)
        df['abs_lon_diff'] = np.abs(d_lon - p_lon)
        df['euclidean_dist'] = np.sqrt(df['abs_lat_diff']**2 + df['abs_lon_diff']**2)
        
        df['haversine_dist'] = haversine_distance(p_lon, p_lat, d_lon, d_lat)
        df['manhattan_dist'] = manhattan_distance(p_lon, p_lat, d_lon, d_lat)
        df['bearing'] = calculate_bearing(p_lon, p_lat, d_lon, d_lat)
        df['sin_bearing'] = np.sin(np.radians(df['bearing']))
        df['cos_bearing'] = np.cos(np.radians(df['bearing']))

        # Airport Proximity & Flags
        df['pickup_dist_jfk'] = haversine_distance(p_lon, p_lat, JFK_COORDS[0], JFK_COORDS[1])
        df['dropoff_dist_jfk'] = haversine_distance(d_lon, d_lat, JFK_COORDS[0], JFK_COORDS[1])
        df['is_jfk_trip'] = ((df['pickup_dist_jfk'] < 2.0) | (df['dropoff_dist_jfk'] < 2.0)).astype(int)

        df['pickup_dist_lga'] = haversine_distance(p_lon, p_lat, LGA_COORDS[0], LGA_COORDS[1])
        df['dropoff_dist_lga'] = haversine_distance(d_lon, d_lat, LGA_COORDS[0], LGA_COORDS[1])
        df['is_lga_trip'] = ((df['pickup_dist_lga'] < 1.8) | (df['dropoff_dist_lga'] < 1.8)).astype(int)

        df['pickup_dist_ewr'] = haversine_distance(p_lon, p_lat, EWR_COORDS[0], EWR_COORDS[1])
        df['dropoff_dist_ewr'] = haversine_distance(d_lon, d_lat, EWR_COORDS[0], EWR_COORDS[1])
        df['is_ewr_trip'] = ((df['pickup_dist_ewr'] < 2.0) | (df['dropoff_dist_ewr'] < 2.0)).astype(int)

        # Passenger count
        if 'passenger_count' not in df.columns:
            df['passenger_count'] = 1

        feature_cols = [
            'passenger_count',
            'haversine_dist',
            'manhattan_dist',
            'abs_lat_diff',
            'abs_lon_diff',
            'euclidean_dist',
            'bearing',
            'sin_bearing',
            'cos_bearing',
            'pickup_dist_jfk',
            'dropoff_dist_jfk',
            'is_jfk_trip',
            'pickup_dist_lga',
            'dropoff_dist_lga',
            'is_lga_trip',
            'pickup_dist_ewr',
            'dropoff_dist_ewr',
            'is_ewr_trip',
            'hour',
            'day_of_week',
            'is_weekend',
            'is_rush_hour',
            'is_late_night',
            'sin_hour',
            'cos_hour',
            'sin_month',
            'cos_month',
            'sin_dayofweek',
            'cos_dayofweek'
        ]

        self.feature_names_ = feature_cols
        return df[feature_cols]
