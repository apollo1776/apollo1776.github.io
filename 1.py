x = str(input())
number = x.count("f")
index = x.find("f")
mas = []
mas.append(index)
if number==1:
    print(index)
elif number>1:
    print(mas[1], mas[-1])
else:
    print("")
