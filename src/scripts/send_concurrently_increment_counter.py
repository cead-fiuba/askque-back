import requests
import threading
import logging

URL = "http://localhost:3000/questionaries/LT3/increment"


# Este script se hizo para probar la concurrencia al momento de incrementar un contador contra el
# servidor node

def thread_function(name):
    logging.info("Thread %s: starting", name)
    requests.put(URL)
    logging.info("Thread %s: finishing", name)


threads = list()
for i in range(1000):
    x = threading.Thread(target=thread_function, args=(i,))
    x.start()
    threads.append(x)

for index, thread in enumerate(threads):
    logging.info("Main    : before joining thread %d.", index)
    thread.join()
    logging.info("Main    : thread %d done", index)
