#! /usr/bin/python
import os
import sys

codefiles = ['.java','.cs','.c','.cpp','.h', '.hpp', '.as', '.as']
generatedExtensions = ['g.i.cs', '.g.cs']
blacklist = ['ReSharper','bin','obj','Debug','Release']
c_family = [';','{','}']

def surveyFor(directory):
	newline = '\n'
	return newline.join(surveyForFilesIn(directory))

def surveyForFilesIn(directory):
	survey = (
		signature(root, file) 
		for root,dirs,files in os.walk(directory) 
		for file in files  
		if containsCode(file) 
		and not useless(root, file)
	)
	return survey

def containsCode(filename):
	return extension(filename) in codefiles

def useless(folder, file):
	return wasGenerated(file) or blacklisted(folder)

def wasGenerated(filename):
	return any(extension in filename for extension in generatedExtensions)

def blacklisted(folder):
	return any(entry in folder for entry in blacklist)

def extension(filename):
	return os.path.splitext(filename)[1]

def signature(root, filename):
	path = absolutePath(root, filename)
	with open(path) as file:
		lines = countLinesIn(file)
		characters = interestingCharacters(file, c_family)
	return format(filename, lines, characters)

def absolutePath(root, filename):
	return os.path.join(root, filename)

def countLinesIn(file):
	lines = len(file.readlines())
	reset(file)
	return lines

def reset(file):
	file.seek(0)

def interestingCharacters(file, interesting_characters):
	signature = (
		character 
		for character in file.read() 
		if character in interesting_characters
	)
	return ''.join(signature)

def format(*components):
	return '%s (%s): %s' % components

if __name__ == "__main__":
	directory = sys.argv[1]
	print surveyFor(directory)