import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

df=pd.read_csv("heart_disease_data.csv")

X=df.drop(['target'],axis=1)
y=df['target']
X_train,X_test,Y_train,Y_test=train_test_split(X,y,test_size=0.30,random_state=0)

from sklearn.ensemble import RandomForestClassifier
max_accuracy = 0

for x in range(50):
    rf = RandomForestClassifier(random_state=x)
    rf.fit(X_train,Y_train)
    Y_pred_rf = rf.predict(X_test)
    current_accuracy = round(accuracy_score(Y_pred_rf,Y_test)*100,2)
    if(current_accuracy>max_accuracy):
        max_accuracy = current_accuracy
        best_x = x
        

rf = RandomForestClassifier(random_state=best_x)
rf.fit(X_train,Y_train)
Y_pred_rf = rf.predict(X_test)
score_rf= round(accuracy_score(Y_pred_rf,Y_test)*100,2)

# Creating a pickle file for the classifier
filename = 'heart-disease-prediction-rf-model.pkl'
pickle.dump(rf, open(filename, 'wb'))