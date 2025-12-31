#******************************
#Authors: Emma Du and Prisha Bhatia
#Date: January 6th, 2022 
#Name: Title Screen for the chilling case of Scott Maguire
#Description: This is the title screen for our game
#******************************
#importing pygame 
import pygame 
import button

pygame.init() 

DISPLAY_WIDTH, DISPLAY_HEIGHT = 800, 600
WHITE = (255, 255, 255) 

#Creating display screen
gameDisplay = pygame.display.set_mode((DISPLAY_WIDTH,DISPLAY_HEIGHT))
pygame.display.set_caption("The Chilling Case of Scott Maguire")

#Starting the clock
clock = pygame.time.Clock() 

#Loading button images
startImg = pygame.image.load('start.png').convert_alpha()
exitImg = pygame.image.load('exit.png').convert_alpha()

start_button = button.Button(80, 200, startImg, 0.6)
exit_button = button.Button(450, 200, exitImg, 0.6)

#Loading background image
hotelImg = pygame.image.load('hotelbg.png')
hotelImg = pygame.transform.scale(hotelImg, (800, 600))

def hotel(x,y):
  gameDisplay.blit(hotelImg, (x, y))

#Game loop 
def gameLoop():
  x = (DISPLAY_WIDTH *0.01 )
  y = (DISPLAY_HEIGHT * 0.01)
  gameExit = False

  while not gameExit:
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        quit() 
  
    gameDisplay.fill(WHITE)
    hotel(x, y)

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

    if start_button.draw(gameDisplay) == True:
     print("Start") #temporary placeholdeer until we get the beginning animation completed
    if exit_button.draw(gameDisplay) == True:
      gameExit = True

    pygame.display.update() 
    clock.tick(60)
gameLoop() 


