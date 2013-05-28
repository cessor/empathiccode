from nose.tools import *
import time

# class Customer(object):
# 	@classmethod
# 	def create(self):
# 		customer = Customer()
# 		customer.created = time.time()
# 		return customer

# def test_created_time():
# 	customer = Customer.create()
# 	time.sleep(3)
# 	assert_equal(customer.created, time.time())



# class Customer(object):
# 	@classmethod
# 	def create(self, time_fn):
# 		customer = Customer()
# 		customer.created = time_fn()
# 		return customer


# def test_created_time():
# 	now = time.time()
# 	customer = Customer.create(lambda: now)
# 	time.sleep(3)
# 	assert_equal(customer.created, now)


class Customer(object):
	@classmethod
	def create(self):
		customer = Customer()
		customer.created = time.time()
		return customer

def test_created_time():
	now = time.time()
	time.sleep(3)
	time.time = lambda: now
	customer = Customer.create()
	assert_equal(customer.created, now)