#import pygame
import pygame 

#intializing pygame 
pygame.init()

#button class for main menu 
class Button():
  def __init__(self, x, y, image, scale, action):
    width = image.get_width()
    height = image.get_height()
    self.image = pygame.transform.scale(image, (int(width * scale), int(height * scale)))
    self.rect = self.image.get_rect()
    self.rect.topleft = (x, y)
    self.clicked = False

  def draw(self, surface): 
    action = False
    #get mouse position 
    mousePosition = pygame.mouse.get_pos()

    #check if mouse is on button, and if clicked
    if self.rect.collidepoint(mousePosition):
      if pygame.mouse.get_pressed()[0] == 1 and self.clicked == False:
        self.clicked = True
        if action == "instructions":
          instructions()
        #if action == "play":
          #play()
        #if action == "replay":
          #animation()
        if action == "backstory":
          backstory()
        if action == "quiz":
          quiz()
        if action == "exit":
          pygame.quit()
          quit()
        # if action == "next": thinking about it
        #   nextpage()
        # if action == "previous:" also thinking
        #   previous page
        if action == "main_menu" or action == "return":
          main_menu()
        
    if pygame.mouse.get_pressed()[0] == 0:
      self.clicked = False

    #draws button on screen
    surface.blit(self.image, (self.rect.x, self.rect.y))

#We put in (self, x, y, image, scale, action) for button:
#if clicked: we cant just put if clicked right? oh i think the mouse get pressed thing will work? so if mouse.get.pressed()? and we continue under that or smth?
# click = pygame.mouse.get_pressed()
# #         if click[0] == 1:
#             #performs action based on the button's said function
#             if action == "animation":
#                 animation()
#             if action == "lessons":
#                 lesson()
#             if action == "quit":
#                 pygame.quit()
#                 quit()
#             if action == "main_menu":
#                 main_menu()

    # if action == "animation":
          #     animation()
          # if action == "lessons":
          #     lesson()
          # if action == "quit":
          #     pygame.quit()
          #     quit()
          # if action == "main_menu" or action == "return":
          #     main_menu()

# and then for putting it into the main menu loop where we have like the if code smth smth == True: 
#then whta would go underneath? like lesson()?
#mmm like in the menu3(i am very attached to this reference oml)
#def main_menu():
    # #creates loop for the game
    # while tutorial:
    #     for event in pygame.event.get():
    #         if event.type == pygame.QUIT:
    #             pygame.quit()
    #             quit()

    #     # draws background image
    #     gameDisplay.blit(background, (0, 0))

    #     #draws buttons
    #     button("Start animation", 50, 325, 250, 100, gray, light_gray, "animation", 32) 
    #     button("Lessons", 50, 450, 250, 100, gray, light_gray, "lessons", 32)
    #     button("Quit", 50, 575, 250, 100, gray, light_gray, "quit", 32)   it just puts in buttons? like all options are functions so we delte our currenrt instructions code file and moce the button to the main meny loop? and what about the bg?  
    #we could maybe salvage some of the instructions code?
    
    #this was what the lesson looked like - each option has its own background brung from the beginning
    #     title_background= pygame.image.load("titleBackground.jpg")
    # title_background = pygame.transform.scale(title_background, size)
    # background = pygame.image.load("background.jpg")
    # background = pygame.transform.scale(background,size)
    #lessons = pygame.image.load("instructions.jpg")
    #lessons = pygame.transform.scale(lessons, size)

    # def lesson():
    # animation = True
    # #creates a loop for the game
    # while animation:
    #     for event in pygame.event.get():
    #         if event.type == pygame.QUIT:
    #             pygame.quit()
    #             quit()         

    #     #blits the background 
    #     gameDisplay.blit(lessons, (0, 0))
    #     #button to return to main menu
    #     button("Back", 800, 650, 250, 100, gray, light_gray, "main_menu", 40)
#it puts in the title screen, then has a button to move forward, and it moves to the animation, that has its own button to go to the main menu
#and that main menu has its own buttons
#the title screen is the first, and its buttons lead the user through the game