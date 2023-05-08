# -*- coding: utf-8 -*-
"""TNR_Filter_YOLO.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1JISDszpvVPoxrx32oUmnzzcxg3NNrdmL
"""
import os
import ast
import subprocess
from common.util import empty_directory

test_img_list = 'datasets/tnr/input/iujeong_2023-04-28_23-11-29.jpg'
tnr_input_path = 'datasets/tnr/input'
tnr_output_path = 'datasets/tnr/output'
tnr_output_result_path = f'{tnr_output_path}/labels'

def is_tnr():
    try:
      cmd = f'python tnr_filtering/yolov5/detect.py --weights tnr_filtering/yolov5/weight/best.pt --img 416 --conf 0.7 --source {tnr_input_path} --project datasets/tnr/ --name output --save-txt --save-conf --exist-ok'
      output = subprocess.check_output(cmd, shell=True)
      output = output.decode('utf-8')
      result_arr = ast.literal_eval(output)

      if result_arr[0] and result_arr[1]:
        return True
      else:
        return False
    except subprocess.CalledProcessError as e:
      print(f"오류: {e}\n종료 상태: {e.returncode}")
      return False

def detect_tnr(closest_images):
  # 폴더 비우기
  empty_directory(f'{tnr_output_path}/*')

  # tnr detection
  is_tnr()

  # 결과 분석
  analyze_results(closest_images)

def analyze_results(closest_images):
  print('param :: ', closest_images)
  for img_name in os.listdir(tnr_output_result_path):
    # 파일 읽기
    with open(f'{tnr_output_result_path}/{img_name}', 'r') as file:
      contents = file.read()

    # 결과 분석
    cat = {'x': 0, 'exist': False}
    tnr = {'x': 0, 'exist': False}
    result = contents.split('\n')
    for line in result:
      txt = line.split(' ')
      # 정보 없는 부분 pass
      if len(txt) < 6: 
        continue
      # class 판별
      cls = int(txt[0])
      if cls == 0:
        cat['exist'] = True
        cat['x'] = float(txt[1])
      elif cls == 1:
        if tnr['exist'] == False:
          tnr['exist'] = True
          tnr['x'] = float(txt[1])
        else:
          # 귀가 2개 잡힌경우
          x2 = float(txt[1])
          if x2 < tnr['x']:
            tnr['x'] = x2

    # Validation
    if cat['exist'] and tnr['exist'] and cat['x'] > tnr['x']: # 고양이 기준으로 오른쪽 귀가 잡혔으면 pass
      print(f'{img_name} is tnr!')
