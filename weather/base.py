import numpy as np
import pandas as pd
from datetime import datetime
import time
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import linear_model
from math import sqrt
from sklearn.neural_network import MLPRegressor
from sklearn import linear_model
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
from sklearn.svm import LinearSVC
from sklearn import linear_model

def str2date(x): return datetime.strptime(x, '%d.%m.%Y %H.%M.%S')


def parseHours(array):
    return np.array([str2int(xi) for xi in array]).reshape(-1, 1)


def dateToTS(array):
    return np.array([d2ts(str2date(xi)) for xi in array])


def d2ts(d):
    return time.mktime(d.timetuple())


def ymdttoTS(data):
    timeStamps = []
    for y, m, d, t in zip(data[:, 0], data[:, 1], data[:, 2], data[:, 3]):
        d = str2date("%02i.%02i.%04i %02s.00.00" % (d, m, y, t[:2]))
        timeStamps.append(d2ts(d))
    return np.array(timeStamps).reshape(-1, 1)


def parseWeekDay(timeStamps):
    return np.array([datetime.fromtimestamp(xi).weekday() for xi in timeStamps]).reshape(-1, 1)


def str2int(x): return int(x[:2])

class Classifier:


	def __init__(self):
		self.validGids = [76,78,90,92,94,102,104,110,184,186,188,190,192,194,196,198,200,202,204,206,208,210,212,214,216,218,234,236,254,256,268,270,276,278,1208,1210,1212,1214,1228,1230,1368,1370,1376,1378,1380,1382,1384,1394,1396,1398,1400,1402,1404,1406,1408,1420,1422,1426,1428,1430,1436,1438,1542,1544,1546,1548,1550,1552,1584,1586,1588,1590,1592,1602,1604,1606,2477,2479,2481,2483,2497,2499,2501,2503,2505,2507,2509,2511,2521,2523,2555,2557,2559,2569,2575,2581,2589,2593,2597,2609,2615,3175,3183,3263,3265,3267,3269,3271,3273,3275,3277,3283,3287,3291,3385,3387,3861,3863,3871,3877,3879,3893,3895,3897,3903,3945,3947,3949,3953,3957,3959,3961,3963,3967,3969,3971,4784,4788,4822,4840,4842,8528,8531,18081,18089,18091,18099,18762,18895,19304,19671]


		dtypes = [int, int, int, int, str, float, float, float,
		          float, float, float, float, float, float, float]
		# keys = ('Year', 'm', 'd', 'Time', 'Time_zone', 'Cloud_amount_18', 'Pressure_msl_hPa', 'Relative_humidity_', 'Precipitation_intensity_mmh', 'Snow_depth_cm', 'Air_temperature_degC', 'Dewpoint_temperature_degC', 'Horizontal_visibility_m', 'Wind_direction_deg', 'Gust_speed_ms')
		keys = ('TimeStamp', 'Hour', 'Weekdays', 'Cloud_amount_18', 'Pressure_msl_hPa', 'Relative_humidity_', 'Precipitation_intensity_mmh', 'Snow_depth_cm',
		        'Air_temperature_degC', 'Dewpoint_temperature_degC', 'Horizontal_visibility_m', 'Wind_direction_deg', 'Gust_speed_ms', 'Wind_speed_ms')

		# features = ['Hour', 'Weekdays', 'Cloud_amount_18', 'Pressure_msl_hPa', 'Relative_humidity_', 'Precipitation_intensity_mmh', 'Snow_depth_cm',
		#           'Air_temperature_degC', 'Dewpoint_temperature_degC', 'Horizontal_visibility_m', 'Wind_direction_deg', 'Gust_speed_ms', 'Wind_speed_ms']
		self.features = ['Hour', 'Weekdays',
		            'Precipitation_intensity_mmh', 'Wind_speed_ms']
		data = pd.read_csv('weatherData.csv', header=0).values


		area_data = pd.read_csv('zones.csv').values

		timeStamps = ymdttoTS(data)
		hours = parseHours(data[:, 3])
		weekdays = parseWeekDay(timeStamps)
		timeStamps = np.append(timeStamps, hours, axis=1)
		timeStamps = np.append(timeStamps, weekdays, axis=1)
		parsedData = np.append(timeStamps, data[:, 5:], axis=1)

		area_data[:, 1] = dateToTS(area_data[:, 1])

		# define the data/predictors as the pre-set feature names
		wdata = pd.DataFrame(parsedData, columns=keys)
		# Put the target in another DataFrame
		adata = pd.DataFrame(area_data, columns=["Group", "TimeStamp", "Amount"])

		df = wdata.merge(adata, on='TimeStamp', how='left')
		df = df.dropna()
		self.models = {}
		for key in self.validGids:
			self.models[key] = self.trainModel(df, key,verbose=False)


	def trainModel(self, rdf, gid, tsize=0.1, state=0, verbose=False):
		df = rdf.loc[rdf['Group'] == gid]
		df = df.drop(['Group', 'TimeStamp'], axis=1)
		df = df.reset_index()
		if verbose:
			X_train, X_test, y_train, y_test = train_test_split(
			    df[self.features].values, df['Amount'].values, test_size=tsize, random_state=state)
			model =linear_model.LassoLars(alpha=1)
			#model = LogisticRegression()
			#model = linear_model.Ridge(alpha=.25)
			# model = linear_model.SGDRegressor(max_iter=1000, tol=4)
			#model = linear_model.Lasso(alpha=0.1)
			
			model.fit(X_train, y_train)
			print(model.score(X_test, y_test))

			sum = 0
			mean = 0
			mean_ytest = 0
			test_size = X_test.shape[0]
			for x in range(0, X_test.shape[0]):
			    # print(model.predict(X_test[x].reshape(1, -1))[0]-y_test[x])
			    d = model.predict(X_test[x].reshape(1, -1)) - y_test[x]
			    print("guess %2f, actu: %2f" %
			          (model.predict(X_test[x].reshape(1, -1)), y_test[x]))
			    mean += d
			    # mean_x += model.predict(X_test[x].reshape(1, -1))
			    mean_ytest += y_test[x]
			    d = d * d
			    sum += d
			
			sum = sqrt(sum) / test_size
			mean = mean / test_size
			mean_ytest = mean_ytest/test_size
			print(model.score(X_test,y_test))
			print(mean_ytest)
			print(mean)
			print(sum)
		else:
			model = MLPRegressor((10,7,4))
			# model = linear_model.SGDRegressor(max_iter=1000, tol=4)
			print(gid)
			model.fit(df[self.features].values, df['Amount'].values)

		return model

	def classify(self,gid, hour, weekday, temp, wind):
		return self.models[gid].predict(np.array([hour,weekday,temp,wind]).reshape(1,-1))[0]

if __name__ == "__main__":
    a = Classifier()
   # print(a.classify(1408,0,3,23,23))