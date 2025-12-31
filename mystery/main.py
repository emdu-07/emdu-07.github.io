#******************************
#Authors: Emma Du and Prisha Bhatia
#Date: January 7th, 2022 
#Name: The chilling case of Scott Maguire
#Description: This is the code for our game, it has #the main menu, title screen, and all other options #for the game
#******************************
#importing pygame + modules 
import pygame 
import time
from pygame import mixer
#initializing pygame
pygame.init()
#background music 
mixer.init()
mixer.music.load("suspense-dark-ambient.mp3")
mixer.music.play(-1)

#creating display screen
displayWidth, displayHeight = 800, 600
gameDisplay = pygame.display.set_mode((displayWidth, displayHeight))
#setting caption for display 
pygame.display.set_caption("The Chilling Case of Scott Maguire")

#starting the clock 
clock = pygame.time.Clock()

#declaring some colours 
white = (255, 255, 255)
black = (0,0,0)

#loading in button images
menu_exit_img = pygame.image.load('menu_exit.png').convert_alpha()
menu_instructions_img = pygame.image.load('instructions.png').convert_alpha()
menu_quiz_img = pygame.image.load('quiz.png').convert_alpha()
menu_backstory_img = pygame.image.load('backstory.png').convert_alpha()
menu_replay_img = pygame.image.load('replaycutscene.png').convert_alpha()
menu_play_img = pygame.image.load('play.png').convert_alpha()
returnButtonImg = pygame.image.load('return.png').convert_alpha()
nextPageButtonImg = pygame.image.load('nextpage.png').convert_alpha()
previousPageButtonImg = pygame.image.load('prevpage.png').convert_alpha()
startImg = pygame.image.load('start.png').convert_alpha()
exitImg = pygame.image.load('exit.png').convert_alpha()
yesImg = pygame.image.load('yes.png').convert_alpha()
noImg = pygame.image.load('no.png').convert_alpha()

#loading in background images
menuImg = pygame.image.load('menu_bg.png') 
menuImg = pygame.transform.scale(menuImg, (800, 600))
instructionsPageImg = pygame.image.load('bookpage.png')
instructionsPageImg = pygame.transform.scale(instructionsPageImg, (800, 600))
backstoryPageImg = pygame.image.load('bookpage.png')
backstoryPageImg = pygame.transform.scale(backstoryPageImg, (800, 600))
quizPageImg = pygame.image.load('bookpage.png')
quizPageImg = pygame.transform.scale(quizPageImg, (800, 600))
hotelImg = pygame.image.load('hotelbg.png')
hotelImg = pygame.transform.scale(hotelImg, (800, 600))
gameInstructions = pygame.image.load('gameInstructions.jpg')
gameInstructions = pygame.transform.scale(gameInstructions, (800, 600))

gameBg = pygame.image.load('playBg.jpg')
gameBg = pygame.transform.scale(gameBg, (800, 600))

#loading in animation images 
frame1 = pygame.image.load('frame1.png')
frame2 = pygame.image.load('frame2.png')
frame3 = pygame.image.load('frame3.png')
frame4 = pygame.image.load('frame4.png')
frame5 = pygame.image.load('frame5.png')
frame6 = pygame.image.load('frame6.png')
frame7 = pygame.image.load('frame7.png')
frame8 = pygame.image.load('frame8.png')
frame9 = pygame.image.load('frame9.png')
frame10 = pygame.image.load('frame10.png')
frame11 = pygame.image.load('frame11.png')
frame12 = pygame.image.load('frame12.png')
frame13 = pygame.image.load('frame13.png')
frame14 = pygame.image.load('frame14.png')
frame15 = pygame.image.load('frame15.png')
frame16 = pygame.image.load('frame16.png')
frame17 = pygame.image.load('frame17.png')
frame18 = pygame.image.load('frame18.png')
frame19 = pygame.image.load('frame19.png')
frame20 = pygame.image.load('frame20.png')
frame21 = pygame.image.load('frame21.png')
frame22 = pygame.image.load('frame22.png')
frame23 = pygame.image.load('frame23.png')
frame24 = pygame.image.load('frame24.png')
frame25 = pygame.image.load('frame25.png')
frame26 = pygame.image.load('frame26.png')
frame27 = pygame.image.load('frame27.png')
frame28 = pygame.image.load('frame28.png')
frame29 = pygame.image.load('frame29.png')
frame30 = pygame.image.load('frame30.png')

#loading in clue + alibi images for game
clue_hitboxes = {
  1: (530, 345, 40, 40),
  2: (750, 420, 40, 40),
  3: (200, 130, 40, 40),
  4: (475, 350, 40, 40),
  5: (200, 340, 40, 40),
}
clientList = pygame.image.load('NotebookClue.png').convert_alpha()
clientListZoomed = pygame.image.load('NotebookClueZoom.png').convert_alpha()
fireExitClue1 = pygame.image.load('FireExitClue1.png').convert_alpha()
fireExitClue2 = pygame.image.load('FireExitClue2.png').convert_alpha()
buisnessCardClue = pygame.image.load('ScottCardClue.png').convert_alpha()
stateOfBodyClue = pygame.image.load('ScottBodyClue.png').convert_alpha()
woolThreadsClue = pygame.image.load('WoolClue.png').convert_alpha()

clientList = pygame.transform.scale(clientList, (800, 600))
clientListZoomed = pygame.transform.scale(clientListZoomed, (800, 600))
fireExitClue1 = pygame.transform.scale(fireExitClue1, (800, 600))
fireExitClue2 = pygame.transform.scale(fireExitClue2,(800, 600))
buisnessCardClue = pygame.transform.scale(buisnessCardClue, (800, 600)) 
stateOfBodyClue = pygame.transform.scale(stateOfBodyClue, (800, 600))
woolThreadsClue = pygame.transform.scale(woolThreadsClue, (800, 600))

svenAlibi = pygame.image.load('SvenAlibi.jpg').convert_alpha()
ameliaAlibi = pygame.image.load('AmeliaAlibi.jpg').convert_alpha()
maidmoiselleAlibi = pygame.image.load('MaidAlibi.jpg').convert_alpha()
douglasAlibi = pygame.image.load('DouglasAlibi.jpg').convert_alpha()
clarkAlibi = pygame.image.load('ClarkAlibi.jpg').convert_alpha()

backgroundInfo = pygame.image.load('BgInfo.png').convert_alpha()

ending1 = pygame.image.load('Ending1.jpg').convert_alpha()
ending2 = pygame.image.load('Ending2.jpg').convert_alpha()
ending3 = pygame.image.load('Ending3.jpg').convert_alpha()
ending4 = pygame.image.load('Ending4.jpg').convert_alpha()

ameliaName = pygame.image.load('AmeliaName.jpg').convert_alpha()
clarkName = pygame.image.load('ClarkName.jpg').convert_alpha()
douglasName = pygame.image.load('DouglasName.jpg').convert_alpha()
maidName = pygame.image.load('MaidName.jpg').convert_alpha()
svenName = pygame.image.load('SvenName.jpg').convert_alpha()


#button class for main menu 
class Button():
  def __init__(self, x, y, image, scale, action):
    width = image.get_width()
    height = image.get_height()
    self.image = pygame.transform.scale(image, (int(width * scale), int(height * scale)))
    self.rect = self.image.get_rect()
    self.rect.topleft = (x, y)
    self.clicked = False

    mousePosition = pygame.mouse.get_pos()

    #check if mouse is on button (getting mouse position), and if clicked
    if self.rect.collidepoint(mousePosition):
      if pygame.mouse.get_pressed()[0] == 1 and not self.clicked:
        self.clicked = True
        if action == "instructions":
          time.sleep(0.1)
          instructions()
        if action == "play":
          time.sleep(0.1)
          prologue()
        if action == "replay" or action == "start":
          time.sleep(0.1)
          animation()
        if action == "backstory":
          time.sleep(0.1)
          disclaimer()
        if action == "page1":
          time.sleep(0.1)
          page1()
        if action == "quiz":
          time.sleep(0.1)
          question1()
        elif action == "exit": #check later as to why error caused 
          time.sleep(0.1)
          bibliography()
          pygame.quit()
          quit()
        if action == "page2":
          time.sleep(0.1)
          page2()
        if action == "page3":
          time.sleep(0.1)
          page3()
        if action == "page4":
          time.sleep(0.1)
          page4()
        elif action == "main_menu" or action == "return":
          time.sleep(0.1)
          main_menu()
        
    if pygame.mouse.get_pressed()[0] == 0:
      self.clicked = False

    #draws button on screen
    gameDisplay.blit(self.image, (self.rect.x, self.rect.y))

# Main Menu 
def main_menu():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    
    gameDisplay.fill(white)
    gameDisplay.blit(menuImg, (0,0))

    #draws buttons 
    Button(525, 350, menu_exit_img, 0.4, "exit")
    Button(100, 200, menu_instructions_img, 0.4, "instructions")
    Button(300, 350, menu_quiz_img, 0.4, "quiz")
    Button(100, 350, menu_backstory_img, 0.4, "backstory")
    Button(500, 185,menu_replay_img, 0.5, "replay")
    Button(300, 200, menu_play_img, 0.4, "play")
    
    pygame.display.update()
    clock.tick(60)

#instructions page 
def instructions():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    
    #draws background 
    gameDisplay.blit(instructionsPageImg, (0,0))

    #instruction text 
    font = pygame.font.SysFont("georgia", 27)
    titleFont = pygame.font.SysFont("georgia", 32, bold=True)

    #apology in advance for all the variables TT
    title = titleFont.render(("Instructions"), True, (black))
    line1 = font.render(("This game is an interactive murder mystery, where"), True, (black))
    line2 = font.render(("you, the player, are a crime investigator. Scott"), True, (black))
    line3 = font.render(("Maguire has been murdered, and it is up to you to"), True, (black))
    line4 = font.render(("find the murderer in a group of people all"), True, (black))
    line5 = font.render(("staying at a hotel. The amount of clues found, the"), True, (black))
    line6 = font.render(("person the player chooses to convict, and the"), True, (black))
    line7 = font.render(("amount of time taken will all lead to different"), True, (black))
    line8 = font.render(("endings (all but one being a bad ending). If not all"), True, (black))
    line9 = font.render(("clues are found in the given time limit, you will"), True, (black))
    line10 = font.render(("have to pick a culprit without being given the chance"), True, (black))
    line11 = font.render(("to review all the suspects alibis."), True, (black))

    #displaying text 
    gameDisplay.blit(title, (295, 90))
    gameDisplay.blit(line1,(120, 148))
    gameDisplay.blit(line2,(140, 173))
    gameDisplay.blit(line3,(130, 200))
    gameDisplay.blit(line4,(150, 225))
    gameDisplay.blit(line5, (130, 250))
    gameDisplay.blit(line6, (140, 275))
    gameDisplay.blit(line7, (135, 300))
    gameDisplay.blit(line8, (120, 325))
    gameDisplay.blit(line9, (125, 350))
    gameDisplay.blit(line10, (110, 376))
    gameDisplay.blit(line11, (220, 403))
  
    #button to return to main menu
    Button(480, 425, returnButtonImg, 0.4, "return")

    pygame.display.update()
    clock.tick(60)

#backstory text 
font = pygame.font.SysFont("georgia", 24)
titleFont = pygame.font.SysFont("georgia", 32, bold=True)

def page1():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 

    #draws background 
    gameDisplay.blit(backstoryPageImg, (0,0))

    gameDisplay.blit(backstoryPageImg, (0,0))
    title = titleFont.render(("Backstory Pt.1"), True, (black))
    line1 = font.render(("It was August 13th, 1989, and a young man named Sven"), True, (black))
    line2 = font.render(("Hastings was on his way to get a loan from WillowHill"), True, (black))
    line3 = font.render(("Services. Sven Hastings was a terrible gambling addict, and"), True, (black))
    line4 = font.render(("at the age of 23 had lost all his wealth gambling away at slots"), True, (black))
    line5 = font.render(("and blackjack at the nearby casino. With no money to his"), True, (black))
    line6 = font.render(("nearby casino. With no money to his name, Sven had no"), True, (black))
    line7 = font.render(("way to cover his daily expenses and debt he had racked"), True, (black))
    line8 = font.render(("up, and, in desperation, decided that getting a loan was his"), True, (black))
    line9 = font.render(("only option. Meanwhile, Scott Maguire was but 20 at"), True, (black))
    line10 = font.render(("the time, and was preparing to meet his first client. He"), True, (black))
    line11 = font.render(("had recently gotten a job at WillowHill Services, and was"), True, (black))
    line12 = font.render(("still getting the hand of the ropes."), True, (black))
    
    #displaying text 
    gameDisplay.blit(title, (295, 75))
    gameDisplay.blit(line1, (120, 128))
    gameDisplay.blit(line2, (130, 153))
    gameDisplay.blit(line3, (110, 180))
    gameDisplay.blit(line4, (110, 205))
    gameDisplay.blit(line5, (120, 230))
    gameDisplay.blit(line6, (110, 255))
    gameDisplay.blit(line7, (125, 280))
    gameDisplay.blit(line8, (105, 305))
    gameDisplay.blit(line9, (125, 330))
    gameDisplay.blit(line10, (110, 356))
    gameDisplay.blit(line11, (110, 383))
    gameDisplay.blit(line12, (230, 410))

    #button to return to main menu
    Button(510, 5, returnButtonImg, 0.35, "return")
    Button(480, 425, nextPageButtonImg, 0.4, "page2")
    pygame.display.update()
    clock.tick(60)

def page2():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 

    gameDisplay.blit(backstoryPageImg, (0,0))
    title = titleFont.render(("Backstory Pt.2"), True, (black))    
    line1 = font.render(("He knew that he would need to use every trick in the book"), True, (black))
    line2 = font.render(("to persuade his client, else his career and salary would"), True, (black))
    line3 = font.render(("suffer greatly. And so, the fateful meeting between the two"), True, (black))
    line4 = font.render(("took place. Scott succeeded, and Sven walked away with his"), True, (black))
    line5 = font.render(("money - or so he thought. Later that week, when Sven went"), True, (black))
    line6 = font.render(("to the bank to take out some cash, he was shocked to find"), True, (black))
    line7 = font.render(("that there was nothing, the same as it had been before he got"), True, (black))
    line8 = font.render(("the loan. Turned out, when Sven later looked at WillowHill's"), True, (black))
    line9 = font.render(("company policy, it was stated, in fine print, that they were"), True, (black))
    line10 = font.render(("not liable for whatever happened to the money after it had"), True, (black))
    line11 = font.render(("been given to the client, and that they would still be"), True, (black))
    line12 = font.render(("subject to loan collection."), True, (black))
    
    #displaying text 
    gameDisplay.blit(title, (295, 85))
    gameDisplay.blit(line1,(120, 138))
    gameDisplay.blit(line2,(120, 163))
    gameDisplay.blit(line3,(100, 190))
    gameDisplay.blit(line4,(115, 215))
    gameDisplay.blit(line5, (130, 240))
    gameDisplay.blit(line6, (110, 265))
    gameDisplay.blit(line7, (105, 290))
    gameDisplay.blit(line8, (105, 315))
    gameDisplay.blit(line9, (100, 340))
    gameDisplay.blit(line10, (110, 365))
    gameDisplay.blit(line11, (140, 390))
    gameDisplay.blit(line12, (270, 415))

    #button to return back to main menu
    Button(510, 5, returnButtonImg, 0.35, "return")
    #button to go to next page
    Button(480, 425, nextPageButtonImg, 0.4, "page3")      
    #button to go to previous page
    Button(100, 425, previousPageButtonImg, 0.4, "page1")
    pygame.display.update()
    clock.tick(60)

def page3():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.blit(backstoryPageImg, (0,0))
    title = titleFont.render(("Backstory Pt.3"), True, (black))
    line1 = font.render(("Sven was, understandably, furious and tried to take this to"), True, (black))
    line2 = font.render(("court stating that he never received the money in the first"), True, (black))
    line3 = font.render(("place. But what could someone like him do against a company"), True, (black))
    line4 = font.render(("with more power than he could ever dream of having? So"), True, (black))
    line5 = font.render(("Sven developed a seething hatred for WillowHill Services and"), True, (black))
    line6 = font.render(("vowed revenge, for Scott Maguire had ruined his life and"), True, (black))
    line7 = font.render(("he wanted the same fate to befall Scott as well. So when he"), True, (black))
    line8 = font.render(("was given the opportunity to team up with WillowHill"), True, (black))
    line9 = font.render(("Services competitor IvoryCourt Estates Ltd, to take out"), True, (black))
    line10 = font.render(("WillowHill's best agent, he took it right away. Scott"), True, (black))
    line11 = font.render(("Maguire had been a thorn in IvoryCourt Estates for"), True, (black))
    line12 = font.render(("quite a while now."), True, (black))

    #displaying text
    gameDisplay.blit(title, (295, 85))
    gameDisplay.blit(line1, (118, 140))
    gameDisplay.blit(line2, (115, 165))
    gameDisplay.blit(line3, (100, 190))
    gameDisplay.blit(line4, (115, 215))
    gameDisplay.blit(line5, (100, 240))
    gameDisplay.blit(line6, (110, 265))
    gameDisplay.blit(line7, (115, 290))
    gameDisplay.blit(line8, (125, 315))
    gameDisplay.blit(line9, (120, 340))
    gameDisplay.blit(line10, (130, 365))
    gameDisplay.blit(line11, (140, 390))
    gameDisplay.blit(line12, (300, 415))
    #button to return back to main menu
    Button(510, 5, returnButtonImg, 0.35, "return")
    #button to go to next page
    Button(480, 425, nextPageButtonImg, 0.4, "page4")      
    #button to go to previous page
    Button(100, 425, previousPageButtonImg, 0.4, "page2")  
    pygame.display.update()
    clock.tick(60)

def page4():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.blit(backstoryPageImg, (0,0))
    title = titleFont.render(("Backstory Pt.4"), True, (black))
    line1 = font.render(("Their potential and current clients were persuaded by Scott"), True, (black))
    line2 = font.render(("to switch to WillowHill Services, and IvoryCourt Estates was"), True, (black))
    line3 = font.render(("losing business. And so, they had done some digging to find"), True, (black))
    line4 = font.render(("one of Scott's oldest clients, someone who had a deep seated"), True, (black))
    line5 = font.render(("grudge against Scott Maguire to eliminate him for the benefit"), True, (black))
    line6 = font.render(("of their company. In that case, if the culprit was ever found"), True, (black))
    line7 = font.render(("out, they could have him take all the blame and suffer no"), True, (black))
    line8 = font.render(("damage to their reputation. Sven, blinded by the thought of"), True, (black))
    line9 = font.render(("money and finally getting his revenge against Scott, paid"), True, (black))
    line10 = font.render(("no mind to the red flags in front of him and proceeded to take "), True, (black))
    line11 = font.render(("IvoryCourt Estates up on the offer. He planned everything"), True, (black))
    line12 = font.render(("out meticulosly and finally, on April 10th, 1994, got the"), True, (black))
    line13 = font.render(("perfect opportunity to execute his plan."), True, (black))

    gameDisplay.blit(title, (295, 75))
    gameDisplay.blit(line1, (110, 120))
    gameDisplay.blit(line2, (110, 145))
    gameDisplay.blit(line3, (100, 170))
    gameDisplay.blit(line4, (115, 195))
    gameDisplay.blit(line5, (100, 220))
    gameDisplay.blit(line6, (110, 245))
    gameDisplay.blit(line7, (115, 270))
    gameDisplay.blit(line8, (105, 295))
    gameDisplay.blit(line9, (115, 320))
    gameDisplay.blit(line10, (100, 345))
    gameDisplay.blit(line11, (110, 370))
    gameDisplay.blit(line12, (125, 395))
    gameDisplay.blit(line13, (200, 420))

    #button to return back to main menu
    Button(510, 5, returnButtonImg, 0.35, "return")
    #button to go to previous page
    Button(100, 425, previousPageButtonImg, 0.4, "page3")
    pygame.display.update()
    clock.tick(60)

#answers for quiz (0-based option indexes)
questions = [
  ["What was the name of the company Scott worked under?", ["WillowHill Services", "IvoryCourt Estates.Ltd", "Saffron Valley Real Estates", "Willow Meadow.Inc"]],
  ["What novel was Scott reading in the beginning cutscene?", ["The Odyssey", "Sherlock Holmes", "Jane Eyre", "Romeo and Juliet"]],
  ["The murderer broke Scott's window while escaping.", ["False", "True"]],
  ["What was the name of the rival company that Sven worked together with?", ["MeadowDale Inc.", "WillowHill Services", "IvoryCourt Estates.Ltd", "CourtIvory Estates"]],
  ["Which one of these items was used in Scott's murder?", ["A gun", "A knife", "A chainsaw", "Poison"]],
  ["What was the weather on the day of Scott's murder?", ["Cloudy", "Rainy", "Sunny", "Snowy"]],
  ["What was the culprit's motive for murder?", ["Lunacy", "Adultery", "Money fraud", "Robbery"]],
  ["How did the killer escape through Scott's window?", ["He didn't escape through the window", "Smashing the window glass", "Jumping out the window", "A fire escape outside the window"]],
]
correctAnswers = [0, 1, 0, 2, 1, 1, 2, 3]

#rendering images 
def imageRender(file, scale):
  image = pygame.image.load(file).convert_alpha()
  width = image.get_width()
  height = image.get_height()
  image = pygame.transform.scale(image, (int(width * scale), int(height * scale)))
  return image
score = 0
question = 0
#wrap text to fit within a max width
def wrap_text(text, font, max_width):
  words = text.split(" ")
  lines = []
  current = ""
  for word in words:
    test_line = (current + " " + word).strip()
    if font.size(test_line)[0] <= max_width:
      current = test_line
    else:
      if current:
        lines.append(current)
      current = word
  if current:
    lines.append(current)
  return lines
#button class for quiz answer buttons 
class quizButton():
  def __init__(self, x, y, text, option, action, question_index, font, max_width):
    self.lines = wrap_text(text, font, max_width)
    self.line_height = font.get_linesize()
    self.rect = pygame.Rect(x, y, max_width, self.line_height * len(self.lines))
    self.clicked = False
    mousePosition = pygame.mouse.get_pos()
    #check if mouse is on button (getting mouse position), and if clicked
    if self.rect.collidepoint(mousePosition):
      if pygame.mouse.get_pressed()[0] == 1 and not self.clicked:
        self.clicked = True
        global score
        if option == correctAnswers[question_index]:
          score += 1
        if action == "question2":
          time.sleep(0.1)
          question2()
        elif action == "question3":
          time.sleep(0.1)
          question3()
        elif action == "question4":
          time.sleep(0.1)
          question4()
        elif action == "question5":
          time.sleep(0.1)
          question5()
        elif action == "question6":
          time.sleep(0.1)
          question6()
        elif action == "question7":
          time.sleep(0.1)
          question7()
        elif action == "question8":
          time.sleep(0.1)
          question8()
        elif action == "result":
          time.sleep(0.1)
          result()
      if pygame.mouse.get_pressed()[0] == 0:
        self.clicked = False
    #draws button on screen
    for i, line in enumerate(self.lines):
      rendered = font.render(line, True, (black))
      gameDisplay.blit(rendered, (self.rect.x, self.rect.y + i * self.line_height))

def draw_quiz(question_index, next_action):
  gameDisplay.blit(quizPageImg, (0, 0)) 
  question_font = pygame.font.SysFont("georgia", 24, bold=True)
  option_font = pygame.font.SysFont("georgia", 22)
  max_width = 620
  question_text, options = questions[question_index]
  question_lines = wrap_text(question_text, question_font, max_width)
  line_height = question_font.get_linesize()
  start_x = 110
  start_y = 120
  for i, line in enumerate(question_lines):
    rendered = question_font.render(line, True, (black))
    gameDisplay.blit(rendered, (start_x, start_y + i * line_height))
  option_y = start_y + line_height * len(question_lines) + 40
  letters = ["A", "B", "C", "D"]
  for option_index, option_text in enumerate(options):
    label = letters[option_index] if option_index < len(letters) else str(option_index + 1)
    labeled_text = f"{label}. {option_text}"
    option_lines = wrap_text(labeled_text, option_font, max_width)
    quizButton(start_x, option_y, labeled_text, option_index, next_action, question_index, option_font, max_width)
    option_y += option_font.get_linesize() * len(option_lines) + 12

#quiz questions 
def question1():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(0, "question2")
    pygame.display.update()
    clock.tick(60)
  
def question2():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(1, "question3")
    pygame.display.update()
    clock.tick(60)

def question3():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(2, "question4")
    pygame.display.update()
    clock.tick(60)

def question4():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(3, "question5")
    pygame.display.update()
    clock.tick(60)

def question5():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(4, "question6")
    pygame.display.update()
    clock.tick(60)

def question6():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(5, "question7")
    pygame.display.update()
    clock.tick(60)

def question7():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(6, "question8")
    pygame.display.update()
    clock.tick(60)

def question8():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    draw_quiz(7, "result")
    pygame.display.update()
    clock.tick(60)

#results page fonts 
scoreFont = pygame.font.SysFont("georgia", 30)
resultsFont = pygame.font.SysFont("georgia", 40, bold=True)

def result():
  gameExit = False
  global score
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    gameDisplay.blit(quizPageImg, (0,0)) 
    results = resultsFont.render(("Results:"), True, (black))
    userScoreLine = scoreFont.render(("You scored " + str(score) + "/8 on this quiz."), True, (black))
    gameDisplay.blit(results, (300, 100))
    gameDisplay.blit(userScoreLine, (200,200)) 
    Button(510, 5, returnButtonImg, 0.35, "return")
    pygame.display.update()
    clock.tick(60)

def disclaimer():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit()
    gameDisplay.fill(black)
    font = pygame.font.SysFont("courier new", 25)
    titleFont = pygame.font.SysFont("courier new", 32, bold=True)
    title = titleFont.render(("Disclaimer:"), True, white)
    text1 = font.render(("The backstory has spoilers for the game."), True, white)
    text2 = font.render(("We recommend playing the game first."), True, white)
    text3 = font.render(("Do you still want to continue?"), True, white)
    gameDisplay.blit(title, (290, 70))
    gameDisplay.blit(text1, (100, 120)) 
    gameDisplay.blit(text2, (120, 160))
    gameDisplay.blit(text3, (150, 200))
    Button(75, 275, yesImg, 0.6, "page1")
    Button(420, 275, noImg, 0.6, "return")
    pygame.display.update()
    clock.tick(60)

#beginning animation code
def animation():
  gameExit = False
  #loading in animation frames
  frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame10, frame11, frame12, frame13, frame14, frame15, frame16, frame17, frame18, frame19, frame20, frame21, frame22, frame23, frame24, frame25, frame26, frame27, frame28, frame29, frame30, frame29]
  value = 0
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    while value <= 30:
      clock.tick(10)
      if value >= len(frames):
        value = 0
      frame = frames[value]
      frame = pygame.transform.scale(frame, (800, 600))
      gameDisplay.blit(frame, (0, 0))
      pygame.display.update()
      value += 1
    gameDisplay.blit(frame, (0, 0))
    pygame.display.update()
    pygame.time.delay(2000)
    gameDisplay.fill(black)
    pygame.display.update()
    pygame.time.delay(2000)
    main_menu()
clue1 = clue2 = clue3 = clue4 = clue5 = False
#button class for clue buttons 
class clueButton():
  def __init__(self, x, y, width, height, clue):
    self.rect = pygame.Rect(x, y, width, height)
    self.clicked = False
    mousePosition = pygame.mouse.get_pos()
    #check if mouse is on button (getting mouse position), and if clicked
    global clue1, clue2, clue3, clue4, clue5
    if self.rect.collidepoint(mousePosition):
      if pygame.mouse.get_pressed()[0] == 1 and not self.clicked:
        self.clicked = True
        if clue == 1:
          time.sleep(0.1)
          print("1")
          clue1 = True
          gameDisplay.blit(buisnessCardClue, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
        elif clue == 2:
          time.sleep(0.1)
          print("2")
          clue2 = True
          gameDisplay.blit(clientList, (0, 0)) 
          pygame.display.update()
          pygame.time.delay(3000)
          gameDisplay.blit(clientListZoomed, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
        elif clue == 3:
          time.sleep(0.1)
          print("3")
          clue3 = True
          gameDisplay.blit(fireExitClue1, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
          gameDisplay.blit(fireExitClue2, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
        elif clue == 4:
          time.sleep(0.1)
          print("4")
          clue4 = True
          gameDisplay.blit(stateOfBodyClue, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
        elif clue == 5:
          time.sleep(0.1)
          print("5")
          clue5 = True
          gameDisplay.blit(woolThreadsClue, (0, 0))
          pygame.display.update()
          pygame.time.delay(5000)
      if pygame.mouse.get_pressed()[0] == 0:
        self.clicked = False

    # Invisible hitbox (no drawing)

#prologue to game
def prologue():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.fill(black)
    pygame.display.update()
    pygame.time.delay(2000)
    gameDisplay.blit(backgroundInfo, (0,0)) 
    pygame.display.update()
    pygame.time.delay(8500)
    play()

allFound = False

#game code 
def play():
  gameExit = False
  timeLimit = 300
  startTime = time.time()
  global clue1, clue2, clue3, clue4, clue5, allFound
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.blit(gameBg, (0, 0))
    pygame.display.update()
    for clue_id, (x, y, w, h) in clue_hitboxes.items():
      clueButton(x, y, w, h, clue_id)
    elapsedTime = time.time() - startTime
    if clue1 and clue2 and clue3 and clue4 and clue5:
      alibi()
      allFound = True
    if elapsedTime > timeLimit:      
      gameDisplay.fill(white)
      pygame.display.update()
      break
      suspect()
    pygame.display.update()
    clock.tick(60)    

def alibi():
  gameExit = False
  alibis = [clarkAlibi, svenAlibi, douglasAlibi, maidmoiselleAlibi, ameliaAlibi]
  value = 0
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    while value < 5:
      alibi = alibis[value]
      alibi = pygame.transform.scale(alibi, (800, 600))
      gameDisplay.blit(alibi, (0,0))
      pygame.display.update()
      pygame.time.delay(7000)
      value += 1
    gameDisplay.blit(alibi, (0,0))
    pygame.display.update()
    pygame.time.delay(2000)
    gameDisplay.fill(black)
    pygame.display.update()
    pygame.time.delay(2000)
    suspect()  

isSuspect = False

#suspect button class 
class suspectButton():
  def __init__(self, x, y, image, suspect, scale):
    width = image.get_width()
    height = image.get_height()
    self.image = pygame.transform.scale(image, (int(width * scale), int(height * scale)))
    self.rect = self.image.get_rect()
    self.rect.topleft = (x, y)
    self.clicked = False
    mousePosition = pygame.mouse.get_pos()
    #check if mouse is on button (getting mouse position), and if clicked
    global isSuspect, allFound
    if self.rect.collidepoint(mousePosition):
      if pygame.mouse.get_pressed()[0] == 1 and not self.clicked:
        self.clicked = True
        if suspect == "sven":
          time.sleep(0.1)
          isSuspect = True
        if not isSuspect and not allFound: 
          gameDisplay.blit(ending1, (0, 0))
          Button(510, 5, returnButtonImg, 0.35, "return")
          pygame.display.update()
          pygame.time.delay(5000)
          main_menu()
        elif isSuspect and not allFound:
          gameDisplay.blit(ending2, (0, 0))
          Button(510, 5, returnButtonImg, 0.35, "return")
          pygame.display.update()
          pygame.time.delay(5000)
          main_menu()
        elif not isSuspect and allFound:
          gameDisplay.blit(ending3, (0, 0))
          Button(510, 5, returnButtonImg, 0.35, "return")
          pygame.display.update()
          pygame.time.delay(5000)
          main_menu()
        else:
          gameDisplay.blit(ending4, (0, 0))
          Button(510, 5, returnButtonImg, 0.35, "return")
          pygame.display.update()
          pygame.time.delay(5000)
          main_menu()
      isSuspect = False
      if pygame.mouse.get_pressed()[0] == 0:
        self.clicked = False
    #draws button on screen
    gameDisplay.blit(self.image, (self.rect.x, self.rect.y))

#choosing a suspect
def suspect():
  gameExit = False
  global isSuspect, allFound
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.fill(black) 
    suspectButton(100, 100, ameliaName, "amelia", 0.5)
    suspectButton(350, 100, clarkName, "clark", 0.5)
    suspectButton(600, 100, douglasName, "douglas", 0.5) 
    suspectButton(200, 310, maidName, "maid", 0.5)
    suspectButton(500, 310, svenName, "sven", 0.5)
    pygame.display.update()
    clock.tick(60)  

#credits page 
def bibliography():
  gameExit = False
  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
    gameDisplay.fill(black)
    heading = pygame.font.SysFont('courier new', 20, bold = True)
    font = pygame.font.SysFont("courier new", 19)
    titleFont = pygame.font.SysFont("courier new", 32, bold=True)
    title = titleFont.render(("Bibliography"), True, white)
    music1 = heading.render(("Music:"), True, white)
    images = heading.render(("Images:"), True, white)
    music2 = font.render(("Defekt Maschine, Pixabay, https://pixabay.com/music/ambient-suspense-dark-ambient-8413/"), True, white)
    fireStairs1 = font.render(("Fire Stairs: Nelson Ndongala, Unsplash,"), True, white)
    fireStairs2 = font.render(("https://unsplash.com/photos/AuBmgZWdzy8"), True, white)
    hotel1 = font.render(("Hotel: Betty Langley's Hotel,"), True, white)
    hotel2 = font.render(("https://www.battylangleys.com/rooms/superior-double"), True, white)
    bookPage1 = font.render(("Book PNG Images Open Book PNG Design, ppt-backgrounds.net"), True, white)
    bookPage2 = font.render(("https://www.ppt-backgrounds.net/macbeth/7210-book-png-images-open-book-png-design-image-backgrounds.html"), True, white)
    dialougeBox1 = font.render(("Dialog box Video game Dialogue, pngwing.com"), True, white)
    dialougeBox2 = font.render(("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Ffree-png-kelsv&psig=AOvVaw3YYJyt9P4vZjRSpttj33Qd&ust=1642721239429000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOCB_9H7vvUCFQAAAAAdAAAAABAD"), True, white)

    gameDisplay.blit(title, (280, 70))
    gameDisplay.blit(music1,(25, 120)) 
    gameDisplay.blit(music2, (25, 160))
    gameDisplay.blit(images, (23, 200))
    gameDisplay.blit(fireStairs1, (23, 240))
    gameDisplay.blit(fireStairs2, (23, 280))
    gameDisplay.blit(hotel1, (23, 330))
    gameDisplay.blit(hotel2, (23, 370))
    gameDisplay.blit(bookPage1, (23, 410))
    gameDisplay.blit(bookPage2, (23, 440))
    gameDisplay.blit(dialougeBox1, (23, 510))
    gameDisplay.blit(dialougeBox2, (23, 540))
    pygame.display.update()
    pygame.time.delay(5000)
    pygame.quit()
    quit()
    clock.tick(60)

#Title screen 
def titleScreen():
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
  
    gameDisplay.fill(white)
    gameDisplay.blit(hotelImg, (0, 0))

    font = pygame.font.SysFont("courier new", 20)
    titleFont = pygame.font.SysFont("courier new", 32, bold=True)
    title = titleFont.render(("The Chilling Case of Scott Maguire"), True, (255, 255, 255))
    names = font.render(("Emma Du and Prisha Bhatia"), True, (255, 255, 255))
    dates = font.render(("January 5th, 2022"), True, (255, 255, 255))
    course = font.render(("ICS2O7"), True, (255, 255, 255))
    gameDisplay.blit(title, (100, 50))
    gameDisplay.blit(names,(100, 100)) 
    gameDisplay.blit(dates, (100, 150))
    gameDisplay.blit(course, (100, 200))
    Button(75, 275, startImg, 0.6, "start")
    Button(420, 275, exitImg, 0.6, "exit")
    
    pygame.display.update() 
    clock.tick(60)
titleScreen()
